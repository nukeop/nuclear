import type { QueueItem, StreamCandidate } from '@nuclearplayer/model';

import { useSoundStore } from '../../stores/soundStore';
import { streamingHost } from '../streamingHost';
import { AudioSourceFactory } from './audioSource';
import { CandidateSource } from './candidateSource';
import { QueueItemUpdater } from './queueItemUpdater';

export type ResolveOptions = {
  autoPlay: boolean;
  startPositionSeconds?: number;
};

export class StreamResolution {
  private activeController: AbortController | null = null;
  private activeItemId: string | null = null;

  constructor(
    private readonly candidateSource = new CandidateSource(),
    private readonly audioSourceFactory = new AudioSourceFactory(),
    private readonly queueItems = new QueueItemUpdater(),
  ) {}

  async resolve(item: QueueItem, options: ResolveOptions): Promise<void> {
    const signal = this.supersedeActiveResolution(item.id);

    if (options.autoPlay) {
      useSoundStore.getState().stop();
    }
    this.queueItems.markLoading(item.id);

    const candidates = await this.candidateSource.forTrack(item.track);
    if (signal.aborted) {
      return;
    }
    if (!candidates) {
      this.queueItems.markError(item.id, 'streaming:errors.noCandidatesFound');
      return;
    }

    this.queueItems.setCandidates(item, candidates);
    await this.tryCandidatesInOrder(item, candidates, signal, options);
  }

  async resolveWithFreshStreams(
    item: QueueItem,
    options: ResolveOptions,
  ): Promise<void> {
    return this.resolve(this.queueItems.clearCachedStreams(item), options);
  }

  private async tryCandidatesInOrder(
    item: QueueItem,
    candidates: StreamCandidate[],
    signal: AbortSignal,
    options: ResolveOptions,
  ): Promise<void> {
    if (signal.aborted) {
      return;
    }

    const candidate = candidates.find((current) => !current.failed);
    if (!candidate) {
      this.queueItems.markError(
        item.id,
        'streaming:errors.allCandidatesFailed',
      );
      return;
    }

    const resolved = await streamingHost.resolveStreamForCandidate(candidate);
    if (!resolved) {
      this.queueItems.markError(
        item.id,
        'streaming:errors.allCandidatesFailed',
      );
      return;
    }

    this.queueItems.updateCandidate(item.id, resolved);

    if (resolved.failed) {
      const remaining = candidates.filter(
        (current) => current.id !== candidate.id,
      );
      await this.tryCandidatesInOrder(item, remaining, signal, options);
      return;
    }

    await this.startPlayback(item, resolved, signal, options);
  }

  private async startPlayback(
    item: QueueItem,
    candidate: StreamCandidate,
    signal: AbortSignal,
    options: ResolveOptions,
  ): Promise<void> {
    const audioSource = await this.audioSourceFactory.fromCandidate(candidate);
    if (signal.aborted) {
      return;
    }

    if (options.startPositionSeconds !== undefined) {
      audioSource.startPositionSeconds = options.startPositionSeconds;
    }

    useSoundStore.getState().setSrc(audioSource);
    this.queueItems.markSuccess(item.id);
    this.activeItemId = null;
    if (options.autoPlay) {
      useSoundStore.getState().play();
    }
  }

  private supersedeActiveResolution(itemId: string): AbortSignal {
    if (this.activeController) {
      this.activeController.abort();
      if (this.activeItemId) {
        this.queueItems.clearStatus(this.activeItemId);
      }
    }
    this.activeController = new AbortController();
    this.activeItemId = itemId;
    return this.activeController.signal;
  }
}

export const streamResolution = new StreamResolution();
