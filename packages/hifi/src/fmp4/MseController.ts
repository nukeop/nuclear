import { LoggerProvider } from '../LoggerProvider';
import { SoundError } from '../SoundError';
import { BufferOperationQueue } from './BufferOperationQueue';
import { GapJumpController } from './GapJumpController';
import {
  MediaSourceAttachment,
  waitForSourceOpen,
} from './MediaSourceAttachment';
import { parseInitSegment } from './parser';
import {
  describeFetchFailure,
  isSourceInvalidStatus,
  RangeFetchFailure,
  SegmentFetcher,
} from './SegmentFetcher';
import { SegmentTimeline } from './SegmentTimeline';
import { StreamHealth } from './StreamHealth';

const HEADER_FETCH_SIZE = 8192;
const LOOKAHEAD_SECONDS = 30;
const SEEK_PREFETCH_COUNT = 3;

export type MseInitOptions = {
  codec?: string;
  onError?: (error: SoundError) => void;
  onSourceInvalid?: () => void;
};

export class MseController {
  private attachment = new MediaSourceAttachment();
  private sourceBuffer: SourceBuffer | null = null;
  private timeline = new SegmentTimeline([]);
  private initSegment: Uint8Array | null = null;
  private abortController: AbortController | null = null;
  private fetcher: SegmentFetcher | null = null;
  private isFetching = false;
  private bufferQueue: BufferOperationQueue | null = null;
  private seekGeneration = 0;
  private health = new StreamHealth();
  private gapJumpController = new GapJumpController();

  async init(
    audio: HTMLAudioElement,
    url: string,
    options: MseInitOptions = {},
  ): Promise<void> {
    this.health = new StreamHealth(options.onSourceInvalid);
    const fetcher = new SegmentFetcher(url);
    this.fetcher = fetcher;
    const abortController = new AbortController();
    this.abortController = abortController;
    const { signal } = abortController;

    const headerBytes = await this.fetchHeader(fetcher, signal, options);
    if (!headerBytes) {
      return;
    }

    const initSegment = this.parseHeader(headerBytes, options);
    if (!initSegment) {
      return;
    }

    const mediaSource = this.attachment.attach(audio);
    if (!mediaSource) {
      options.onError?.(new SoundError('mseUnavailable'));
      return;
    }

    await waitForSourceOpen(mediaSource);
    if (signal.aborted) {
      return;
    }

    const sourceBuffer = await this.prepareSourceBuffer(
      mediaSource,
      initSegment,
      options,
    );
    if (!sourceBuffer || signal.aborted) {
      return;
    }

    this.gapJumpController.start(audio, sourceBuffer, () =>
      this.handleTimeUpdate(audio),
    );

    if (this.timeline.isEmpty) {
      return;
    }

    await this.fetchAndAppendSegment(0, signal);
  }

  private async fetchHeader(
    fetcher: SegmentFetcher,
    signal: AbortSignal,
    options: MseInitOptions,
  ): Promise<Uint8Array | null> {
    const result = await fetcher.fetchRange(0, HEADER_FETCH_SIZE - 1, signal);
    if (result.kind === 'ok') {
      return result.bytes;
    }
    if (result.kind === 'aborted') {
      return null;
    }
    if (result.kind === 'httpError' && isSourceInvalidStatus(result.status)) {
      if (this.health.invalidate()) {
        void LoggerProvider.get().warn(
          `[MSE] Header fetch rejected with status ${result.status}; the stream URL is no longer valid`,
        );
      }
      return null;
    }
    options.onError?.(
      new SoundError('loadFailed', describeFetchFailure(result)),
    );
    return null;
  }

  private parseHeader(
    headerBytes: Uint8Array,
    options: MseInitOptions,
  ): Uint8Array | null {
    try {
      const { initSegmentEnd, segments } = parseInitSegment(headerBytes);
      this.timeline = new SegmentTimeline(segments);
      this.initSegment = headerBytes.slice(0, initSegmentEnd);
      return this.initSegment;
    } catch {
      options.onError?.(new SoundError('unsupportedFormat'));
      return null;
    }
  }

  private async prepareSourceBuffer(
    mediaSource: MediaSource,
    initSegment: Uint8Array,
    options: MseInitOptions,
  ): Promise<SourceBuffer | null> {
    const mimeType = `audio/mp4; codecs="${options.codec ?? 'mp4a.40.2'}"`;
    const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
    this.sourceBuffer = sourceBuffer;
    const bufferQueue = new BufferOperationQueue(sourceBuffer);
    this.bufferQueue = bufferQueue;
    mediaSource.duration = this.timeline.durationSeconds;

    try {
      await bufferQueue.enqueue(() =>
        sourceBuffer.appendBuffer(initSegment.buffer as ArrayBuffer),
      );
    } catch {
      options.onError?.(new SoundError('appendRejected'));
      return null;
    }

    return sourceBuffer;
  }

  handleStall(audio: HTMLAudioElement): void {
    const { sourceBuffer } = this;
    if (!sourceBuffer) {
      return;
    }

    this.gapJumpController.poll(audio, sourceBuffer.buffered);
  }

  handleTimeUpdate(audio: HTMLAudioElement): void {
    const { sourceBuffer, abortController } = this;
    if (!sourceBuffer || !abortController || abortController.signal.aborted) {
      return;
    }

    if (
      this.health.isInvalid ||
      this.health.isWaitingToRetry ||
      this.isFetching
    ) {
      return;
    }

    const nextIndex = this.nextSegmentIndexToBuffer(
      sourceBuffer,
      audio.currentTime,
    );
    if (nextIndex === -1) {
      return;
    }

    this.isFetching = true;
    this.fetchAndAppendSegment(nextIndex, abortController.signal).finally(
      () => {
        this.isFetching = false;
        this.handleTimeUpdate(audio);
      },
    );
  }

  private nextSegmentIndexToBuffer(
    sourceBuffer: SourceBuffer,
    currentTime: number,
  ): number {
    const { buffered } = sourceBuffer;
    if (buffered.length === 0) {
      return -1;
    }

    const bufferedEnd = buffered.end(buffered.length - 1);
    if (bufferedEnd >= currentTime + LOOKAHEAD_SECONDS) {
      return -1;
    }

    return this.timeline.nextUnfetchedIndex(bufferedEnd);
  }

  async handleSeeking(audio: HTMLAudioElement): Promise<void> {
    const { sourceBuffer, bufferQueue, initSegment, abortController } = this;

    if (
      this.health.isInvalid ||
      !sourceBuffer ||
      !bufferQueue ||
      !initSegment ||
      !abortController ||
      abortController.signal.aborted ||
      this.timeline.isEmpty
    ) {
      return;
    }

    const seekTime = audio.currentTime;
    const targetIndex = this.timeline.segmentIndexForTime(seekTime);
    if (targetIndex === -1) {
      return;
    }

    if (this.isTimeBuffered(sourceBuffer, seekTime)) {
      return;
    }

    this.seekGeneration += 1;

    try {
      await bufferQueue.enqueue(() => sourceBuffer.remove(0, Infinity));
      this.timeline.clearFetched();

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
        this.timeline.length,
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

    this.attachment.detach(audio);

    this.bufferQueue?.close();
    this.bufferQueue = null;
    this.sourceBuffer = null;
    this.timeline = new SegmentTimeline([]);
    this.initSegment = null;
    this.fetcher = null;
    this.health = new StreamHealth();
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

  private async fetchAndAppendSegment(
    segmentIndex: number,
    signal: AbortSignal,
  ): Promise<void> {
    const { timeline, sourceBuffer, fetcher, bufferQueue } = this;

    if (
      !sourceBuffer ||
      !fetcher ||
      !bufferQueue ||
      !timeline.contains(segmentIndex)
    ) {
      return;
    }

    if (timeline.isFetched(segmentIndex)) {
      return;
    }

    timeline.markFetched(segmentIndex);

    const segment = timeline.get(segmentIndex);
    const generation = this.seekGeneration;

    const result = await fetcher.fetchRange(
      segment.startByte,
      segment.endByte,
      signal,
    );
    if (result.kind !== 'ok') {
      timeline.unmarkFetched(segmentIndex);
      if (result.kind !== 'aborted') {
        this.reportFetchFailure(segmentIndex, result);
      }
      return;
    }

    const segmentData = result.bytes;
    this.health.registerSuccess();

    if (signal.aborted) {
      timeline.unmarkFetched(segmentIndex);
      return;
    }

    if (this.seekGeneration !== generation) {
      timeline.unmarkFetched(segmentIndex);
      return;
    }

    try {
      await bufferQueue.enqueue(() =>
        sourceBuffer.appendBuffer(segmentData.buffer as ArrayBuffer),
      );
    } catch {
      timeline.unmarkFetched(segmentIndex);
      return;
    }

    if (timeline.isFinal(segmentIndex) && !sourceBuffer.updating) {
      this.attachment.endStream();
    }
  }

  private reportFetchFailure(
    segmentIndex: number,
    failure: RangeFetchFailure,
  ): void {
    const logger = LoggerProvider.get();

    this.health.registerFailure(failure, {
      invalidByStatus: (status) => {
        void logger.warn(
          `[MSE] Segment ${segmentIndex} fetch rejected with status ${status}; the stream URL is no longer valid`,
        );
      },
      exhausted: (attempt) => {
        void logger.warn(
          `[MSE] Segment ${segmentIndex} fetch failed ${attempt} times in a row; giving up on the stream URL`,
        );
      },
      retrying: (attempt, backoffMs) => {
        void logger.warn(
          `[MSE] Segment ${segmentIndex} fetch failed (attempt ${attempt}, retrying in ${backoffMs}ms): ${describeFetchFailure(failure)}`,
        );
      },
    });
  }
}
