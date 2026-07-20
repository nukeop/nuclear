import { omit } from 'lodash-es';

import type { QueueItem, StreamCandidate } from '@nuclearplayer/model';

import { useQueueStore } from '../../stores/queueStore';
import { useSoundStore } from '../../stores/soundStore';
import { hasActiveStreamingProvider, streamingHost } from '../streamingHost';
import { AudioSourceFactory } from './audioSource';
import { candidatesForTrack } from './candidateSource';

export type ResolveOptions = {
  autoPlay: boolean;
  startPositionSeconds?: number;
};

export class StreamResolution {
  private activeController: AbortController | null = null;
  private activeItemId: string | null = null;

  constructor(private readonly audioSourceFactory = new AudioSourceFactory()) {}

  async resolve(item: QueueItem, options: ResolveOptions): Promise<void> {
    const signal = this.supersedeActiveResolution(item.id);
    const { updateItemState } = useQueueStore.getState();

    if (options.autoPlay) {
      useSoundStore.getState().stop();
    }
    updateItemState(item.id, { status: 'loading', error: undefined });

    if (!hasActiveStreamingProvider()) {
      this.failItem(item.id, 'streaming:errors.noProviderAvailable');
      return;
    }

    const candidates = await candidatesForTrack(item.track);
    if (signal.aborted) {
      return;
    }
    if (!candidates) {
      this.failItem(item.id, 'streaming:errors.noCandidatesFound');
      return;
    }

    updateItemState(item.id, {
      track: { ...item.track, streamCandidates: candidates },
    });
    await this.tryCandidatesInOrder(item, candidates, signal, options);
  }

  async resolveWithFreshStreams(
    item: QueueItem,
    options: ResolveOptions,
  ): Promise<void> {
    const track = {
      ...item.track,
      streamCandidates: item.track.streamCandidates?.map((candidate) =>
        omit(candidate, ['stream', 'lastResolvedAtIso']),
      ),
    };
    useQueueStore.getState().updateItemState(item.id, { track });
    return this.resolve({ ...item, track }, options);
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
      this.failItem(item.id, 'streaming:errors.allCandidatesFailed');
      return;
    }

    const resolved = await streamingHost.resolveStreamForCandidate(candidate);
    if (signal.aborted) {
      return;
    }
    if (!resolved) {
      this.failItem(item.id, 'streaming:errors.noProviderAvailable');
      return;
    }

    useQueueStore.getState().updateCandidate(item.id, resolved);

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
    useQueueStore.getState().updateItemState(item.id, { status: 'success' });
    this.activeItemId = null;
    if (options.autoPlay) {
      useSoundStore.getState().play();
    }
  }

  private failItem(itemId: string, errorKey: string): void {
    useQueueStore.getState().updateItemState(itemId, {
      status: 'error',
      error: errorKey,
    });
  }

  private supersedeActiveResolution(itemId: string): AbortSignal {
    if (this.activeController) {
      this.activeController.abort();
      if (this.activeItemId) {
        useQueueStore.getState().updateItemState(this.activeItemId, {
          status: undefined,
          error: undefined,
        });
      }
    }
    this.activeController = new AbortController();
    this.activeItemId = itemId;
    return this.activeController.signal;
  }
}

export const streamResolution = new StreamResolution();
