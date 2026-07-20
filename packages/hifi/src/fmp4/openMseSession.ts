import { SoundError } from '../SoundError';
import { BufferOperationQueue } from './BufferOperationQueue';
import {
  MediaSourceAttachment,
  waitForSourceOpen,
} from './MediaSourceAttachment';
import { MseSession } from './MseSession';
import { parseInitSegment } from './parser';
import {
  describeFetchFailure,
  isSourceInvalidStatus,
  SegmentFetcher,
} from './SegmentFetcher';
import { SegmentTimeline } from './SegmentTimeline';

export class StreamInvalidError extends Error {
  constructor(readonly status: number) {
    super(
      `Header fetch rejected with status ${status}; the stream URL is no longer valid`,
    );
    this.name = 'StreamInvalidError';
  }
}

export type SessionSetupOptions = {
  codec?: string;
  onSourceInvalid?: () => void;
};

const fetchHeader = async (
  fetcher: SegmentFetcher,
  signal: AbortSignal,
): Promise<Uint8Array | null> => {
  const result = await fetcher.fetchRange(0, 8192 - 1, signal);

  if (result.kind === 'ok') {
    return result.bytes;
  }
  if (result.kind === 'aborted') {
    return null;
  }
  if (result.kind === 'httpError' && isSourceInvalidStatus(result.status)) {
    throw new StreamInvalidError(result.status);
  }
  throw new SoundError('loadFailed', describeFetchFailure(result));
};

const parseHeader = (
  headerBytes: Uint8Array,
): { timeline: SegmentTimeline; initSegment: Uint8Array } => {
  try {
    const { initSegmentEnd, segments } = parseInitSegment(headerBytes);
    return {
      timeline: new SegmentTimeline(segments),
      initSegment: headerBytes.slice(0, initSegmentEnd),
    };
  } catch {
    throw new SoundError('unsupportedFormat');
  }
};

export const openMseSession = async (
  audio: HTMLAudioElement,
  url: string,
  attachment: MediaSourceAttachment,
  signal: AbortSignal,
  options: SessionSetupOptions,
): Promise<MseSession | null> => {
  const fetcher = new SegmentFetcher(url);

  const headerBytes = await fetchHeader(fetcher, signal);
  if (!headerBytes) {
    return null;
  }

  const { timeline, initSegment } = parseHeader(headerBytes);

  const mediaSource = attachment.attach(audio);
  if (!mediaSource) {
    throw new SoundError('mseUnavailable');
  }

  await waitForSourceOpen(mediaSource);
  if (signal.aborted) {
    return null;
  }

  const mimeType = `audio/mp4; codecs="${options.codec ?? 'mp4a.40.2'}"`;
  const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
  const bufferQueue = new BufferOperationQueue(sourceBuffer);
  mediaSource.duration = timeline.durationSeconds;

  try {
    await bufferQueue.enqueue(() =>
      sourceBuffer.appendBuffer(initSegment.buffer as ArrayBuffer),
    );
  } catch {
    throw new SoundError('appendRejected');
  }

  if (signal.aborted) {
    return null;
  }

  return new MseSession({
    attachment,
    sourceBuffer,
    bufferQueue,
    timeline,
    initSegment,
    fetcher,
    onSourceInvalid: options.onSourceInvalid,
  });
};
