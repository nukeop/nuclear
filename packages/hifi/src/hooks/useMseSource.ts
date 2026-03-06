import { RefObject, useEffect, useRef } from 'react';

import { parseInitSegment, SegmentReference } from '../fmp4';
import { AudioSource } from '../types';

const HEADER_FETCH_SIZE = 8192;
const LOOKAHEAD_SECONDS = 30;
const SEEK_PREFETCH_COUNT = 3;

type MseBackend = {
  Constructor: typeof MediaSource;
  managed: boolean;
};

const getMseBackend = (): MseBackend | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if ('ManagedMediaSource' in window) {
    return {
      Constructor: (window as unknown as Record<string, typeof MediaSource>)
        .ManagedMediaSource,
      managed: true,
    };
  }

  if ('MediaSource' in window) {
    return { Constructor: MediaSource, managed: false };
  }

  return undefined;
};

const waitForUpdateEnd = (sourceBuffer: SourceBuffer): Promise<void> =>
  new Promise((resolve) => {
    if (!sourceBuffer.updating) {
      resolve();
      return;
    }

    const onUpdateEnd = () => {
      sourceBuffer.removeEventListener('updateend', onUpdateEnd);
      resolve();
    };
    sourceBuffer.addEventListener('updateend', onUpdateEnd);
  });

const safeAppendBuffer = (
  sourceBuffer: SourceBuffer,
  data: Uint8Array,
): void => {
  sourceBuffer.appendBuffer(data.buffer as ArrayBuffer);
};

const appendToBuffer = (
  sourceBuffer: SourceBuffer,
  data: Uint8Array,
  queue: Uint8Array[],
): void => {
  if (sourceBuffer.updating) {
    queue.push(data);
    return;
  }

  safeAppendBuffer(sourceBuffer, data);
};

const findSegmentForTime = (
  time: number,
  segments: SegmentReference[],
): number => {
  let low = 0;
  let high = segments.length - 1;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    const segment = segments[mid];

    if (time < segment.startTime) {
      high = mid - 1;
    } else if (time >= segment.endTime) {
      low = mid + 1;
    } else {
      return mid;
    }
  }

  return -1;
};

const fetchRange = async (
  url: string,
  startByte: number,
  endByte: number,
  signal: AbortSignal,
): Promise<Uint8Array> => {
  const response = await fetch(url, {
    headers: { Range: `bytes=${startByte}-${endByte}` },
    signal,
  });
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};

const isTimeBuffered = (sourceBuffer: SourceBuffer, time: number): boolean => {
  const { buffered } = sourceBuffer;
  for (let index = 0; index < buffered.length; index++) {
    if (time >= buffered.start(index) && time < buffered.end(index)) {
      return true;
    }
  }
  return false;
};

export const useMseSource = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
  isReady: boolean,
) => {
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const segmentMapRef = useRef<SegmentReference[]>([]);
  const initSegmentRef = useRef<Uint8Array | null>(null);
  const fetchedSegmentsRef = useRef<Set<number>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const appendQueueRef = useRef<Uint8Array[]>([]);
  const prevUrlRef = useRef<string | null>(null);

  const isMse = src.protocol === 'mse';
  const durationSeconds = src.durationSeconds;

  const cleanup = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const audio = audioRef.current;
    if (audio && audio.srcObject) {
      audio.srcObject = null;
    }

    const mediaSource = mediaSourceRef.current;
    if (mediaSource && mediaSource.readyState === 'open') {
      try {
        mediaSource.endOfStream();
      } catch {
        // MediaSource may already be closing
      }
    }

    mediaSourceRef.current = null;
    sourceBufferRef.current = null;
    segmentMapRef.current = [];
    initSegmentRef.current = null;
    fetchedSegmentsRef.current = new Set();
    appendQueueRef.current = [];
  };

  const fetchAndAppendSegment = async (
    segmentIndex: number,
    signal: AbortSignal,
  ): Promise<void> => {
    const segments = segmentMapRef.current;
    const sourceBuffer = sourceBufferRef.current;

    if (!sourceBuffer || segmentIndex >= segments.length) {
      return;
    }

    if (fetchedSegmentsRef.current.has(segmentIndex)) {
      return;
    }

    fetchedSegmentsRef.current.add(segmentIndex);

    const segment = segments[segmentIndex];

    let segmentData: Uint8Array;
    try {
      segmentData = await fetchRange(
        src.url,
        segment.startByte,
        segment.endByte,
        signal,
      );
    } catch {
      fetchedSegmentsRef.current.delete(segmentIndex);
      return;
    }

    if (signal.aborted) {
      fetchedSegmentsRef.current.delete(segmentIndex);
      return;
    }

    appendToBuffer(sourceBuffer, segmentData, appendQueueRef.current);
    await waitForUpdateEnd(sourceBuffer);

    const allFetched = fetchedSegmentsRef.current.size === segments.length;
    const mediaSource = mediaSourceRef.current;

    if (
      allFetched &&
      mediaSource &&
      mediaSource.readyState === 'open' &&
      !sourceBuffer.updating
    ) {
      mediaSource.endOfStream();
    }
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!isMse) {
      cleanup();
      prevUrlRef.current = null;
      return;
    }

    if (src.url === prevUrlRef.current) {
      return;
    }

    cleanup();
    prevUrlRef.current = src.url;

    const backend = getMseBackend();
    if (!backend) {
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const { signal } = abortController;

    const initialize = async () => {
      let headerBytes: Uint8Array;
      try {
        headerBytes = await fetchRange(
          src.url,
          0,
          HEADER_FETCH_SIZE - 1,
          signal,
        );
      } catch {
        return;
      }

      let index;
      try {
        index = parseInitSegment(headerBytes);
      } catch {
        return;
      }

      const { initSegmentEnd, segments, codec } = index;
      segmentMapRef.current = segments;

      const initSegment = headerBytes.slice(0, initSegmentEnd);
      initSegmentRef.current = initSegment;
      fetchedSegmentsRef.current = new Set();
      appendQueueRef.current = [];

      const mediaSource = new backend.Constructor();
      mediaSourceRef.current = mediaSource;

      if (backend.managed) {
        audio.disableRemotePlayback = true;
        audio.srcObject = mediaSource;
      } else {
        const objectUrl = URL.createObjectURL(mediaSource);
        objectUrlRef.current = objectUrl;
        audio.src = objectUrl;
      }

      await new Promise<void>((resolve) => {
        const onSourceOpen = () => {
          mediaSource.removeEventListener('sourceopen', onSourceOpen);
          resolve();
        };
        mediaSource.addEventListener('sourceopen', onSourceOpen);
      });

      if (signal.aborted) {
        return;
      }

      const mimeType = `audio/mp4; codecs="${codec}"`;
      const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
      sourceBufferRef.current = sourceBuffer;

      sourceBuffer.addEventListener('updateend', () => {
        const queue = appendQueueRef.current;
        if (queue.length > 0 && !sourceBuffer.updating) {
          const nextChunk = queue.shift()!;
          safeAppendBuffer(sourceBuffer, nextChunk);
        }
      });

      mediaSource.duration = durationSeconds!;

      safeAppendBuffer(sourceBuffer, initSegment);
      await waitForUpdateEnd(sourceBuffer);

      if (signal.aborted || segments.length === 0) {
        return;
      }

      await fetchAndAppendSegment(0, signal);
    };

    initialize();

    return () => {
      cleanup();
      prevUrlRef.current = null;
    };
  }, [src, isReady, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isMse) {
      return;
    }

    const onTimeUpdate = () => {
      const sourceBuffer = sourceBufferRef.current;
      const segments = segmentMapRef.current;
      if (!sourceBuffer || segments.length === 0) {
        return;
      }

      const { buffered } = sourceBuffer;
      if (buffered.length === 0) {
        return;
      }

      const bufferedEnd = buffered.end(buffered.length - 1);
      const lookAheadThreshold = audio.currentTime + LOOKAHEAD_SECONDS;

      if (bufferedEnd >= lookAheadThreshold) {
        return;
      }

      const nextSegmentIndex = findSegmentForTime(bufferedEnd, segments);
      if (nextSegmentIndex === -1) {
        return;
      }

      const targetIndex = nextSegmentIndex + 1;
      if (targetIndex >= segments.length) {
        return;
      }

      if (fetchedSegmentsRef.current.has(targetIndex)) {
        return;
      }

      const controller = abortControllerRef.current;
      if (!controller || controller.signal.aborted) {
        return;
      }

      fetchAndAppendSegment(targetIndex, controller.signal);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [src, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isMse) {
      return;
    }

    const onSeeking = async () => {
      const sourceBuffer = sourceBufferRef.current;
      const segments = segmentMapRef.current;
      const initSegment = initSegmentRef.current;
      const controller = abortControllerRef.current;

      if (
        !sourceBuffer ||
        !initSegment ||
        !controller ||
        controller.signal.aborted ||
        segments.length === 0
      ) {
        return;
      }

      const seekTime = audio.currentTime;
      const targetIndex = findSegmentForTime(seekTime, segments);
      if (targetIndex === -1) {
        return;
      }

      if (isTimeBuffered(sourceBuffer, seekTime)) {
        return;
      }

      try {
        if (sourceBuffer.updating) {
          sourceBuffer.abort();
        }
        sourceBuffer.remove(0, Infinity);
        await waitForUpdateEnd(sourceBuffer);

        if (controller.signal.aborted) {
          return;
        }

        safeAppendBuffer(sourceBuffer, initSegment);
        await waitForUpdateEnd(sourceBuffer);

        if (controller.signal.aborted) {
          return;
        }

        const lastIndex = Math.min(
          targetIndex + SEEK_PREFETCH_COUNT,
          segments.length,
        );
        for (
          let segmentIndex = targetIndex;
          segmentIndex < lastIndex;
          segmentIndex++
        ) {
          if (controller.signal.aborted) {
            return;
          }
          await fetchAndAppendSegment(segmentIndex, controller.signal);
        }
      } catch {
        return;
      }
    };

    audio.addEventListener('seeking', onSeeking);
    return () => {
      audio.removeEventListener('seeking', onSeeking);
    };
  }, [src, audioRef]);
};
