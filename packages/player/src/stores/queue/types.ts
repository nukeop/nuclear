import type {
  Queue,
  QueueItem,
  StreamCandidate,
  Track,
} from '@nuclearplayer/model';

export type QueueStore = Queue & {
  playOrder: string[];
  playCursor: number;
  playNextTailId: string | null;
  isLoading: boolean;
  isReady: boolean;
  loadFromDisk: () => Promise<void>;
  addToQueue: (tracks: Track[]) => void;
  addNext: (tracks: Track[]) => void;
  addAt: (tracks: Track[], index: number) => void;
  removeByIds: (ids: string[]) => void;
  removeByIndices: (indices: number[]) => void;
  clearQueue: () => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  moveBefore: (itemId: string, beforeItemId: string | null) => void;
  updateItemState: (id: string, updates: Partial<QueueItem>) => void;
  updateCandidate: (itemId: string, candidate: StreamCandidate) => void;
  removeCandidate: (itemId: string, candidateId: string) => void;
  selectCandidate: (itemId: string, candidateId: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
  goToId: (id: string) => void;
  getCurrentItem: () => QueueItem | undefined;
  getItemById: (id: string) => QueueItem | undefined;
};
