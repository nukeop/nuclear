import type { Queue, QueueItem, RepeatMode, Track } from '@nuclearplayer/model';

export type { Queue, QueueItem, RepeatMode };

export type QueueItemStateUpdate = Partial<{
  status: QueueItem['status'];
  error: QueueItem['error'];
}>;

export type QueueListener = (queue: Queue) => void;
export type QueueItemListener = (item: QueueItem | undefined) => void;

export type QueueHost = {
  getQueue: () => Promise<Queue>;
  getCurrentItem: () => Promise<QueueItem | undefined>;
  addToQueue: (tracks: Track[]) => Promise<void>;
  addNext: (tracks: Track[]) => Promise<void>;
  addAt: (tracks: Track[], index: number) => Promise<void>;
  removeByIds: (ids: string[]) => Promise<void>;
  removeByIndices: (indices: number[]) => Promise<void>;
  clearQueue: () => Promise<void>;
  reorder: (fromIndex: number, toIndex: number) => Promise<void>;
  updateItemState: (id: string, updates: QueueItemStateUpdate) => Promise<void>;
  goToNext: () => Promise<void>;
  goToPrevious: () => Promise<void>;
  goToIndex: (index: number) => Promise<void>;
  goToId: (id: string) => Promise<void>;
  subscribe: (listener: QueueListener) => () => void;
  subscribeToCurrentItem: (listener: QueueItemListener) => () => void;
};
