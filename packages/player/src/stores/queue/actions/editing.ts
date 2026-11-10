import { produce } from 'immer';
import takeWhile from 'lodash-es/takeWhile';
import { v4 as uuidv4 } from 'uuid';
import { StateCreator } from 'zustand';

import type { QueueItem, Track } from '@nuclearplayer/model';
import { stripResolutionState } from '@nuclearplayer/model';

import { Logger } from '../../../services/logger';
import { getSetting } from '../../settingsStore';
import { useSoundStore } from '../../soundStore';
import { withPersistence } from '../persistence';
import { PlayOrder } from '../playOrder';
import type { QueueStore } from '../types';

const createQueueItem = (track: Track): QueueItem => ({
  id: uuidv4(),
  track: stripResolutionState(track),
  status: 'idle',
  addedAtIso: new Date().toISOString(),
});

const updatePlayOrder = (
  state: QueueStore,
  update: (playOrder: PlayOrder) => PlayOrder,
) => {
  const shuffleEnabled =
    (getSetting('core.playback.shuffle') as boolean) ?? false;
  if (!shuffleEnabled) {
    return;
  }
  const playOrder = update(
    new PlayOrder(state.playOrder, state.playCursor, state.playNextTailId),
  );
  state.playOrder = playOrder.ids;
  state.playCursor = playOrder.cursor;
  state.playNextTailId = playOrder.playNextTailId;
};

const insertTracks = (state: QueueStore, tracks: Track[], index: number) => {
  const newItems = tracks.map(createQueueItem);
  state.items.splice(index, 0, ...newItems);

  if (index <= state.currentIndex) {
    state.currentIndex += newItems.length;
  }

  return newItems.map((item) => item.id);
};

export const createEditingSlice: StateCreator<
  QueueStore,
  [],
  [],
  Pick<
    QueueStore,
    | 'addToQueue'
    | 'addNext'
    | 'addAt'
    | 'removeByIds'
    | 'removeByIndices'
    | 'clearQueue'
    | 'reorder'
    | 'moveBefore'
  >
> = (set, get) => ({
  addToQueue: withPersistence(get, (tracks: Track[]) => {
    set(
      produce((state: QueueStore) => {
        const newItems = tracks.map(createQueueItem);
        state.items.push(...newItems);
        const newIds = newItems.map((item) => item.id);
        updatePlayOrder(state, (playOrder) => playOrder.shuffleIn(newIds));
      }),
    );
    Logger.queue.debug(`Added ${tracks.length} tracks to queue`);
  }),

  addNext: withPersistence(get, (tracks: Track[]) => {
    set(
      produce((state: QueueStore) => {
        const newIds = insertTracks(state, tracks, state.currentIndex + 1);
        updatePlayOrder(state, (playOrder) => playOrder.playNext(newIds));
      }),
    );
  }),

  addAt: withPersistence(get, (tracks: Track[], index: number) => {
    set(
      produce((state: QueueStore) => {
        const newIds = insertTracks(state, tracks, index);
        updatePlayOrder(state, (playOrder) => playOrder.shuffleIn(newIds));
      }),
    );
  }),

  removeByIds: withPersistence(get, (ids: string[]) => {
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

  removeByIndices: withPersistence(get, (indices: number[]) => {
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

  clearQueue: withPersistence(get, () => {
    const itemCount = get().items.length;
    set({ items: [], currentIndex: 0 });
    useSoundStore.getState().stop();
    Logger.queue.info(`Cleared queue (${itemCount} items removed)`);
  }),

  reorder: withPersistence(get, (fromIndex: number, toIndex: number) => {
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

  moveBefore: withPersistence(
    get,
    (itemId: string, beforeItemId: string | null) => {
      const movedItem = get().getItemById(itemId);
      if (!movedItem || itemId === beforeItemId) {
        return;
      }
      const currentItemId = get().getCurrentItem()?.id;

      const otherItems = get().items.filter((item) => item.id !== itemId);
      const itemsBefore = takeWhile(
        otherItems,
        (item) => item.id !== beforeItemId,
      );
      const itemsAfter = otherItems.slice(itemsBefore.length);
      const items = [...itemsBefore, movedItem, ...itemsAfter];

      set({
        items,
        currentIndex: items.findIndex((item) => item.id === currentItemId),
      });
    },
  ),
});
