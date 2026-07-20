import { omit } from 'lodash-es';

import type { QueueItem, StreamCandidate } from '@nuclearplayer/model';

import { useQueueStore } from '../../stores/queueStore';
import { useSoundStore } from '../../stores/soundStore';
import { streamingHost } from '../streamingHost';
import { AudioSourceFactory } from './audioSource';
import { CandidateSource } from './candidateSource';

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
  ) {}

  async resolve(item: QueueItem, options: ResolveOptions): Promise<void> {
    const signal = this.supersedeActiveResolution(item.id);
    const { updateItemState } = useQueueStore.getState();

    if (options.autoPlay) {
      useSoundStore.getState().stop();
    }
    updateItemState(item.id, { status: 'loading', error: undefined });

    const candidates = await this.candidateSource.forTrack(item.track);
    if (signal.aborted) {
      return;
    }
    if (!candidates) {
      updateItemState(item.id, {
        status: 'error',
        error: 'streaming:errors.noCandidatesFound',
      });
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
      useQueueStore.getState().updateItemState(item.id, {
        status: 'error',
        error: 'streaming:errors.allCandidatesFailed',
      });
      return;
    }

    const resolved = await streamingHost.resolveStreamForCandidate(candidate);
    if (!resolved) {
      useQueueStore.getState().updateItemState(item.id, {
        status: 'error',
        error: 'streaming:errors.allCandidatesFailed',
      });
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
