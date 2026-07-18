import { LoggerProvider } from '../LoggerProvider';
import { BufferOperationQueue } from './BufferOperationQueue';
import { FetchBackoff } from './FetchBackoff';
import { GapJumpController } from './GapJumpController';
import { getMseBackend } from './MseBackend';
import { parseInitSegment, SegmentReference } from './parser';
import { SegmentFetcher } from './SegmentFetcher';

const HEADER_FETCH_SIZE = 8192;
const LOOKAHEAD_SECONDS = 30;
const SEEK_PREFETCH_COUNT = 3;
const BUFFERED_END_TOLERANCE_SECONDS = 0.01;

export class MseController {
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private segments: SegmentReference[] = [];
  private initSegment: Uint8Array | null = null;
  private fetchedSegments = new Set<number>();
  private abortController: AbortController | null = null;
  private objectUrl: string | null = null;
  private fetcher: SegmentFetcher | null = null;
  private isFetching = false;
  private bufferQueue: BufferOperationQueue | null = null;
  private seekGeneration = 0;
  private backoff = new FetchBackoff();
  private gapJumpController = new GapJumpController();

  async init(
    audio: HTMLAudioElement,
    url: string,
    codec?: string,
    onError?: (error: Error) => void,
  ): Promise<void> {
    const fetcher = new SegmentFetcher(url);
    this.fetcher = fetcher;
    const abortController = new AbortController();
    this.abortController = abortController;
    const { signal } = abortController;

    let headerBytes: Uint8Array;
    try {
      headerBytes = await fetcher.fetchRange(0, HEADER_FETCH_SIZE - 1, signal);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      onError?.(new Error(`Could not load the audio stream: ${reason}`));
      return;
    }

    let index;
    try {
      index = parseInitSegment(headerBytes);
    } catch {
      onError?.(
        new Error(
          'The audio stream is not in a supported format. Try a different source for this track.',
        ),
      );
      return;
    }

    const { initSegmentEnd, segments } = index;
    this.segments = segments;

    const sidxDuration =
      segments.length > 0 ? segments[segments.length - 1].endTime : 0;

    const initSegment = headerBytes.slice(0, initSegmentEnd);
    this.initSegment = initSegment;
    this.fetchedSegments = new Set();

    const backend = getMseBackend();
    if (!backend) {
      onError?.(
        new Error(
          'Streaming is not available because this system lacks MediaSource Extensions. Updating your system web engine may fix this.',
        ),
      );
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
    const bufferQueue = new BufferOperationQueue(sourceBuffer);
    this.bufferQueue = bufferQueue;

    mediaSource.duration = sidxDuration;

    try {
      await bufferQueue.enqueue(() =>
        sourceBuffer.appendBuffer(initSegment.buffer as ArrayBuffer),
      );
    } catch {
      onError?.(
        new Error(
          'The audio engine rejected the stream data. The codec may be unsupported. Try a different source for this track.',
        ),
      );
      return;
    }

    if (signal.aborted) {
      return;
    }

    this.gapJumpController.start(audio, sourceBuffer, () =>
      this.handleTimeUpdate(audio),
    );

    if (segments.length === 0) {
      return;
    }

    await this.fetchAndAppendSegment(0, signal);
  }

  handleStall(audio: HTMLAudioElement): void {
    const { sourceBuffer } = this;
    if (!sourceBuffer) {
      return;
    }

    this.gapJumpController.poll(audio, sourceBuffer.buffered);
  }

  handleTimeUpdate(audio: HTMLAudioElement): void {
    const { sourceBuffer, segments } = this;
    if (this.isFetching || !sourceBuffer || segments.length === 0) {
      return;
    }

    if (this.backoff.isWaiting) {
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
      this.handleTimeUpdate(audio);
    });
  }

  async handleSeeking(audio: HTMLAudioElement): Promise<void> {
    const {
      sourceBuffer,
      bufferQueue,
      segments,
      initSegment,
      abortController,
    } = this;

    if (
      !sourceBuffer ||
      !bufferQueue ||
      !initSegment ||
      !abortController ||
      abortController.signal.aborted ||
      segments.length === 0
    ) {
      return;
    }

    const seekTime = audio.currentTime;
    const targetIndex = this.findSegmentForTime(seekTime);
    if (targetIndex === -1) {
      return;
    }

    if (this.isTimeBuffered(sourceBuffer, seekTime)) {
      return;
    }

    this.seekGeneration += 1;

    try {
      await bufferQueue.enqueue(() => sourceBuffer.remove(0, Infinity));
      this.fetchedSegments.clear();

      if (abortController.signal.aborted) {
        return;
      }

      await bufferQueue.enqueue(() =>
        sourceBuffer.appendBuffer(initSegment.buffer as ArrayBuffer),
      );

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
    this.gapJumpController.stop();

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

    this.bufferQueue?.close();
    this.bufferQueue = null;
    this.mediaSource = null;
    this.sourceBuffer = null;
    this.segments = [];
    this.initSegment = null;
    this.fetchedSegments = new Set();
    this.fetcher = null;
  }

  private findSegmentForTime(time: number): number {
    const { segments } = this;
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

  private isTimeBuffered(sourceBuffer: SourceBuffer, time: number): boolean {
    const { buffered } = sourceBuffer;
    for (let index = 0; index < buffered.length; index++) {
      if (time >= buffered.start(index) && time < buffered.end(index)) {
        return true;
      }
    }
    return false;
  }

  private findNextUnfetchedSegment(bufferedEnd: number): number {
    for (let index = 0; index < this.segments.length; index++) {
      if (this.fetchedSegments.has(index)) {
        continue;
      }
      if (
        this.segments[index].endTime >
        bufferedEnd + BUFFERED_END_TOLERANCE_SECONDS
      ) {
        return index;
      }
    }
    return -1;
  }

  private async fetchAndAppendSegment(
    segmentIndex: number,
    signal: AbortSignal,
  ): Promise<void> {
    const { segments, sourceBuffer, fetcher, bufferQueue } = this;

    if (
      !sourceBuffer ||
      !fetcher ||
      !bufferQueue ||
      segmentIndex >= segments.length
    ) {
      return;
    }

    if (this.fetchedSegments.has(segmentIndex)) {
      return;
    }

    this.fetchedSegments.add(segmentIndex);

    const segment = segments[segmentIndex];
    const generation = this.seekGeneration;

    let segmentData: Uint8Array;
    try {
      segmentData = await fetcher.fetchRange(
        segment.startByte,
        segment.endByte,
        signal,
      );
    } catch (error) {
      this.fetchedSegments.delete(segmentIndex);
      if (!signal.aborted) {
        this.reportFetchFailure(segmentIndex, error);
      }
      return;
    }

    this.backoff.reset();

    if (signal.aborted) {
      this.fetchedSegments.delete(segmentIndex);
      return;
    }

    if (this.seekGeneration !== generation) {
      this.fetchedSegments.delete(segmentIndex);
      return;
    }

    try {
      await bufferQueue.enqueue(() =>
        sourceBuffer.appendBuffer(segmentData.buffer as ArrayBuffer),
      );
    } catch {
      this.fetchedSegments.delete(segmentIndex);
      return;
    }

    const isFinalSegment = segmentIndex === segments.length - 1;
    const mediaSource = this.mediaSource;

    if (
      isFinalSegment &&
      mediaSource &&
      mediaSource.readyState === 'open' &&
      !sourceBuffer.updating
    ) {
      mediaSource.endOfStream();
    }
  }

  private reportFetchFailure(segmentIndex: number, error: unknown): void {
    const { attempt, backoffMs } = this.backoff.registerFailure();
    const reason = error instanceof Error ? error.message : String(error);
    void LoggerProvider.get().warn(
      `[MSE] Segment ${segmentIndex} fetch failed (attempt ${attempt}, retrying in ${backoffMs}ms): ${reason}`,
    );
  }
}
