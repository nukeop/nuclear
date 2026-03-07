import { LazyStore } from '@tauri-apps/plugin-store';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import type { Queue, QueueItem, Track } from '@nuclearplayer/model';

import { Logger } from '../services/logger';
import { resolveErrorMessage } from '../utils/logging';
import { getSetting } from './settingsStore';
import { useSoundStore } from './soundStore';

const QUEUE_FILE = 'queue.json';
const store = new LazyStore(QUEUE_FILE);

type QueueStore = Queue & {
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
  updateItemState: (id: string, updates: Partial<QueueItem>) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
  goToId: (id: string) => void;
  getCurrentItem: () => QueueItem | undefined;
};

const createQueueItem = (track: Track): QueueItem => ({
  id: uuidv4(),
  track,
  status: 'idle',
  addedAtIso: new Date().toISOString(),
});

const getDirectionalIndex = (
  state: Pick<QueueStore, 'items' | 'currentIndex'>,
  direction: 'forward' | 'backward',
): number => {
  const { items, currentIndex } = state;
  const shuffleEnabled =
    (getSetting('core.playback.shuffle') as boolean) ?? false;
  const repeatMode = (getSetting('core.playback.repeat') as string) ?? 'off';

  if (items.length === 0) {
    return currentIndex;
  }

  if (repeatMode === 'one') {
    return currentIndex;
  }

  if (shuffleEnabled) {
    return getShuffledIndex(items.length, currentIndex);
  }

  if (direction === 'forward') {
    if (currentIndex < items.length - 1) {
      return currentIndex + 1;
    }
    return repeatMode === 'all' ? 0 : currentIndex;
  }

  if (currentIndex > 0) {
    return currentIndex - 1;
  }

  return repeatMode === 'all' ? items.length - 1 : currentIndex;
};

const getShuffledIndex = (length: number, currentIndex: number): number => {
  if (length <= 1) {
    return currentIndex;
  }

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }

  return nextIndex;
};

const saveToDisk = async (): Promise<void> => {
  try {
    const state = useQueueStore.getState();
    await store.set('queue.items', state.items);
    await store.set('queue.currentIndex', state.currentIndex);
    await store.save();
  } catch (error) {
    Logger.queue.error(`Failed to save queue: ${resolveErrorMessage(error)}`);
  }
};

const withPersistence = <T extends unknown[]>(
  fn: (...args: T) => void,
): ((...args: T) => void) => {
  return (...args: T) => {
    fn(...args);
    void saveToDisk();
  };
};

export const useQueueStore = create<QueueStore>((set, get) => ({
  items: [],
  currentIndex: 0,
  isReady: false,
  isLoading: false,

  loadFromDisk: async () => {
    set({ isLoading: true });
    const items = (await store.get<QueueItem[]>('queue.items')) ?? [];
    const currentIndex = (await store.get<number>('queue.currentIndex')) ?? 0;

    const sanitizedIndex =
      currentIndex >= 0 && currentIndex < items.length ? currentIndex : 0;

    set({
      items,
      currentIndex: sanitizedIndex,
      isReady: true,
      isLoading: false,
    });

    Logger.queue.info(`Loaded ${items.length} items from disk`);
  },

  addToQueue: withPersistence((tracks: Track[]) => {
    set(
      produce((state: QueueStore) => {
        const newItems = tracks.map(createQueueItem);
        state.items.push(...newItems);
      }),
    );
    Logger.queue.debug(`Added ${tracks.length} tracks to queue`);
  }),

  addNext: (tracks: Track[]) => {
    const { currentIndex } = get();
    get().addAt(tracks, currentIndex + 1);
  },

  addAt: withPersistence((tracks: Track[], index: number) => {
    set(
      produce((state: QueueStore) => {
        const newItems = tracks.map(createQueueItem);
        state.items.splice(index, 0, ...newItems);
        if (index <= state.currentIndex) {
          state.currentIndex += newItems.length;
        }
      }),
    );
  }),

  removeByIds: withPersistence((ids: string[]) => {
    const currentItem = get().getCurrentItem();
    const currentItemRemoved = currentItem && ids.includes(currentItem.id);

    set(
      produce((state: QueueStore) => {
        const idsSet = new Set(ids);
        const removedBeforeCurrent = state.items
          .slice(0, state.currentIndex)
          .filter((item) => idsSet.has(item.id)).length;

        state.items = state.items.filter((item) => !idsSet.has(item.id));
        state.currentIndex = Math.max(
          0,
          state.currentIndex - removedBeforeCurrent,
        );

        if (state.currentIndex >= state.items.length) {
          state.currentIndex = Math.max(0, state.items.length - 1);
        }
      }),
    );

    if (currentItemRemoved || get().items.length === 0) {
      useSoundStore.getState().stop();
    }
  }),

  removeByIndices: withPersistence((indices: number[]) => {
    const currentIndex = get().currentIndex;
    const currentIndexRemoved = indices.includes(currentIndex);

    set(
      produce((state: QueueStore) => {
        const indicesSet = new Set(indices);
        const removedBeforeCurrent = indices.filter(
          (idx) => idx < state.currentIndex,
        ).length;

        state.items = state.items.filter((_, idx) => !indicesSet.has(idx));
        state.currentIndex = Math.max(
          0,
          state.currentIndex - removedBeforeCurrent,
        );

        if (state.currentIndex >= state.items.length) {
          state.currentIndex = Math.max(0, state.items.length - 1);
        }
      }),
    );

    if (currentIndexRemoved || get().items.length === 0) {
      useSoundStore.getState().stop();
    }
  }),

  clearQueue: withPersistence(() => {
    const itemCount = get().items.length;
    set({ items: [], currentIndex: 0 });
    useSoundStore.getState().stop();
    Logger.queue.info(`Cleared queue (${itemCount} items removed)`);
  }),

  reorder: withPersistence((fromIndex: number, toIndex: number) => {
    set(
      produce((state: QueueStore) => {
        const [movedItem] = state.items.splice(fromIndex, 1);
        state.items.splice(toIndex, 0, movedItem);

        if (state.currentIndex === fromIndex) {
          state.currentIndex = toIndex;
        } else if (
          fromIndex < state.currentIndex &&
          toIndex >= state.currentIndex
        ) {
          state.currentIndex -= 1;
        } else if (
          fromIndex > state.currentIndex &&
          toIndex <= state.currentIndex
        ) {
          state.currentIndex += 1;
        }
      }),
    );
  }),

  updateItemState: withPersistence(
    (id: string, updates: Partial<QueueItem>) => {
      set(
        produce((state: QueueStore) => {
          const item = state.items.find((item) => item.id === id);
          if (item) {
            Object.assign(item, updates);
          }
        }),
      );
    },
  ),

  goToNext: withPersistence(() => {
    const state = get();
    const nextIndex = getDirectionalIndex(state, 'forward');
    if (nextIndex !== state.currentIndex) {
      useSoundStore.getState().stop();
      set({ currentIndex: nextIndex });
      Logger.queue.debug(`Moved to next track (index ${nextIndex})`);
    }
  }),

  goToPrevious: withPersistence(() => {
    const state = get();
    const previousIndex = getDirectionalIndex(state, 'backward');
    if (previousIndex !== state.currentIndex) {
      useSoundStore.getState().stop();
      set({ currentIndex: previousIndex });
      Logger.queue.debug(`Moved to previous track (index ${previousIndex})`);
    }
  }),

  goToIndex: withPersistence((index: number) => {
    const { items } = get();
    if (index >= 0 && index < items.length) {
      useSoundStore.getState().stop();
      set({ currentIndex: index });
    }
  }),

  goToId: withPersistence((id: string) => {
    const { items } = get();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      useSoundStore.getState().stop();
      set({ currentIndex: index });
    }
  }),

  getCurrentItem: () => {
    const { items, currentIndex } = get();
    return items[currentIndex];
  },
}));

export const initializeQueueStore = async (): Promise<void> => {
  await useQueueStore.getState().loadFromDisk();
};
