import { parseInitSegment, SegmentReference } from './parser';

const HEADER_FETCH_SIZE = 8192;
const LOOKAHEAD_SECONDS = 30;
const SEEK_PREFETCH_COUNT = 3;

type MseBackend = {
  Constructor: typeof MediaSource;
  managed: boolean;
};

function getMseBackend(): MseBackend | undefined {
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
}

function waitForUpdateEnd(sourceBuffer: SourceBuffer): Promise<void> {
  return new Promise((resolve) => {
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
}

function findSegmentForTime(
  time: number,
  segments: SegmentReference[],
): number {
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
}

async function fetchRange(
  url: string,
  startByte: number,
  endByte: number,
  signal: AbortSignal,
): Promise<Uint8Array> {
  const response = await fetch(url, {
    headers: { Range: `bytes=${startByte}-${endByte}` },
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Fetch failed with status ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

function isTimeBuffered(sourceBuffer: SourceBuffer, time: number): boolean {
  const { buffered } = sourceBuffer;
  for (let index = 0; index < buffered.length; index++) {
    if (time >= buffered.start(index) && time < buffered.end(index)) {
      return true;
    }
  }
  return false;
}

export class MseController {
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private segments: SegmentReference[] = [];
  private initSegment: Uint8Array | null = null;
  private fetchedSegments = new Set<number>();
  private abortController: AbortController | null = null;
  private objectUrl: string | null = null;
  private url = '';
  private isFetching = false;

  async init(
    audio: HTMLAudioElement,
    url: string,
    durationSeconds: number,
    codec?: string,
    onError?: (error: Error) => void,
  ): Promise<void> {
    this.url = url;
    const abortController = new AbortController();
    this.abortController = abortController;
    const { signal } = abortController;

    let headerBytes: Uint8Array;
    try {
      headerBytes = await fetchRange(url, 0, HEADER_FETCH_SIZE - 1, signal);
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error
          : new Error(`Failed to load stream: ${url}`),
      );
      return;
    }

    let index;
    try {
      index = parseInitSegment(headerBytes);
    } catch {
      onError?.(new Error('Failed to parse audio stream header'));
      return;
    }

    const { initSegmentEnd, segments } = index;
    this.segments = segments;

    const initSegment = headerBytes.slice(0, initSegmentEnd);
    this.initSegment = initSegment;
    this.fetchedSegments = new Set();

    const backend = getMseBackend();
    if (!backend) {
      return;
    }

    const mediaSource = new backend.Constructor();
    this.mediaSource = mediaSource;

    if (backend.managed) {
      audio.disableRemotePlayback = true;
      audio.srcObject = mediaSource;
    } else {
      const objectUrl = URL.createObjectURL(mediaSource);
      this.objectUrl = objectUrl;
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

    const mimeType = `audio/mp4; codecs="${codec ?? 'mp4a.40.2'}"`;

    const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
    this.sourceBuffer = sourceBuffer;

    mediaSource.duration = durationSeconds;

    sourceBuffer.appendBuffer(initSegment.buffer as ArrayBuffer);
    await waitForUpdateEnd(sourceBuffer);

    if (signal.aborted || segments.length === 0) {
      return;
    }

    await this.fetchAndAppendSegment(0, signal);
  }

  handleTimeUpdate(audio: HTMLAudioElement): void {
    const { sourceBuffer, segments } = this;
    if (this.isFetching || !sourceBuffer || segments.length === 0) {
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

    const nextIndex = this.findNextUnfetchedSegment(bufferedEnd);
    if (nextIndex === -1) {
      return;
    }

    const controller = this.abortController;
    if (!controller || controller.signal.aborted) {
      return;
    }

    this.isFetching = true;
    this.fetchAndAppendSegment(nextIndex, controller.signal).finally(() => {
      this.isFetching = false;
    });
  }

  async handleSeeking(audio: HTMLAudioElement): Promise<void> {
    const { sourceBuffer, segments, initSegment, abortController } = this;

    if (
      !sourceBuffer ||
      !initSegment ||
      !abortController ||
      abortController.signal.aborted ||
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
      this.fetchedSegments.clear();

      if (abortController.signal.aborted) {
        return;
      }

      sourceBuffer.appendBuffer(initSegment.buffer as ArrayBuffer);
      await waitForUpdateEnd(sourceBuffer);

      if (abortController.signal.aborted) {
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
        if (abortController.signal.aborted) {
          return;
        }
        await this.fetchAndAppendSegment(segmentIndex, abortController.signal);
      }
    } catch {
      return;
    }
  }

  destroy(audio: HTMLAudioElement | null): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    if (audio && audio.srcObject) {
      audio.srcObject = null;
    }

    const mediaSource = this.mediaSource;
    if (mediaSource && mediaSource.readyState === 'open') {
      try {
        mediaSource.endOfStream();
      } catch {
        // MediaSource may already be closing
      }
    }

    this.mediaSource = null;
    this.sourceBuffer = null;
    this.segments = [];
    this.initSegment = null;
    this.fetchedSegments = new Set();
    this.url = '';
  }

  private findNextUnfetchedSegment(bufferedEnd: number): number {
    for (let index = 0; index < this.segments.length; index++) {
      if (this.fetchedSegments.has(index)) {
        continue;
      }
      if (this.segments[index].startTime >= bufferedEnd - 0.01) {
        return index;
      }
    }
    return -1;
  }

  private async fetchAndAppendSegment(
    segmentIndex: number,
    signal: AbortSignal,
  ): Promise<void> {
    const { segments, sourceBuffer } = this;

    if (!sourceBuffer || segmentIndex >= segments.length) {
      return;
    }

    if (this.fetchedSegments.has(segmentIndex)) {
      return;
    }

    this.fetchedSegments.add(segmentIndex);

    const segment = segments[segmentIndex];

    let segmentData: Uint8Array;
    try {
      segmentData = await fetchRange(
        this.url,
        segment.startByte,
        segment.endByte,
        signal,
      );
    } catch {
      this.fetchedSegments.delete(segmentIndex);
      return;
    }

    if (signal.aborted) {
      this.fetchedSegments.delete(segmentIndex);
      return;
    }

    sourceBuffer.appendBuffer(segmentData.buffer as ArrayBuffer);
    await waitForUpdateEnd(sourceBuffer);

    const allFetched = this.fetchedSegments.size === segments.length;
    const mediaSource = this.mediaSource;

    if (
      allFetched &&
      mediaSource &&
      mediaSource.readyState === 'open' &&
      !sourceBuffer.updating
    ) {
      mediaSource.endOfStream();
    }
  }
}
