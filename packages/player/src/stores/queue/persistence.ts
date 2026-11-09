import { LazyStore } from '@tauri-apps/plugin-store';
import { StateCreator } from 'zustand';

import type { QueueItem } from '@nuclearplayer/model';

import { Logger } from '../../services/logger';
import { errorMessage } from '../../utils/errorMessage';
import { getSetting } from '../settingsStore';
import { PlayOrder } from './playOrder';
import type { QueueStore } from './types';

const QUEUE_FILE = 'queue.json';
const store = new LazyStore(QUEUE_FILE);

const loadPlayOrder = async (
  state: Pick<QueueStore, 'items' | 'currentIndex'>,
) => {
  const shuffleEnabled =
    (getSetting('core.playback.shuffle') as boolean) ?? false;
  if (!shuffleEnabled) {
    return { playOrder: [], playCursor: 0 };
  }

  const playOrder = (await store.get<string[]>('queue.playOrder')) ?? [];
  if (playOrder.length === 0) {
    const shuffled = PlayOrder.fromQueue(
      state.items,
      state.currentIndex,
    ).shuffle();
    return { playOrder: shuffled.ids, playCursor: shuffled.cursor };
  }
  const playCursor = await store.get<number>('queue.playCursor');
  return { playOrder, playCursor };
};

const saveToDisk = async (get: () => QueueStore): Promise<void> => {
  try {
    const state = get();
    await store.set('queue.items', state.items);
    await store.set('queue.currentIndex', state.currentIndex);
    await store.set('queue.playOrder', state.playOrder);
    await store.set('queue.playCursor', state.playCursor);
    await store.save();
  } catch (error) {
    Logger.queue.error(`Failed to save queue: ${errorMessage(error)}`);
  }
};

let latestSave = Promise.resolve();

export const queueSaved = () => latestSave;

export const withPersistence = <T extends unknown[]>(
  get: () => QueueStore,
  fn: (...args: T) => void,
): ((...args: T) => void) => {
  return (...args: T) => {
    fn(...args);
    latestSave = latestSave.then(() => saveToDisk(get));
  };
};

export const createPersistenceSlice: StateCreator<
  QueueStore,
  [],
  [],
  Pick<QueueStore, 'loadFromDisk'>
> = (set) => ({
  loadFromDisk: async () => {
    set({ isLoading: true });
    const items = (await store.get<QueueItem[]>('queue.items')) ?? [];
    const currentIndex = (await store.get<number>('queue.currentIndex')) ?? 0;

    const sanitizedIndex =
      currentIndex >= 0 && currentIndex < items.length ? currentIndex : 0;

    const resetItems = items.map((item) => ({
      ...item,
      status: 'idle' as const,
      error: undefined,
    }));

    const loadedQueue = { items: resetItems, currentIndex: sanitizedIndex };

    set({
      ...loadedQueue,
      ...(await loadPlayOrder(loadedQueue)),
      isReady: true,
      isLoading: false,
    });

    Logger.queue.info(`Loaded ${resetItems.length} items from disk`);
  },
});
