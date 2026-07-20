import type { QueueItem, StreamCandidate } from '@nuclearplayer/model';

import { useQueueStore } from '../../stores/queueStore';

export class QueueItemUpdater {
  markLoading(itemId: string): void {
    this.update(itemId, { status: 'loading', error: undefined });
  }

  markError(itemId: string, error: string): void {
    this.update(itemId, { status: 'error', error });
  }

  markSuccess(itemId: string): void {
    this.update(itemId, { status: 'success' });
  }

  clearStatus(itemId: string): void {
    this.update(itemId, { status: undefined, error: undefined });
  }

  updateCandidate(itemId: string, candidate: StreamCandidate): void {
    const item = useQueueStore
      .getState()
      .items.find((queueItem) => queueItem.id === itemId);
    if (!item) {
      return;
    }

    const streamCandidates = item.track.streamCandidates?.map((current) => {
      if (current.id === candidate.id) {
        return candidate;
      }
      return current;
    });
    this.update(itemId, { track: { ...item.track, streamCandidates } });
  }

  setCandidates(item: QueueItem, candidates: StreamCandidate[]): void {
    this.update(item.id, {
      track: { ...item.track, streamCandidates: candidates },
    });
  }

  clearCachedStreams(item: QueueItem): QueueItem {
    const track = {
      ...item.track,
      streamCandidates: item.track.streamCandidates?.map((candidate) => {
        const cleared = { ...candidate };
        delete cleared.stream;
        delete cleared.lastResolvedAtIso;
        return cleared;
      }),
    };
    this.update(item.id, { track });
    return { ...item, track };
  }

  private update(itemId: string, updates: Partial<QueueItem>): void {
    useQueueStore.getState().updateItemState(itemId, updates);
  }
}
