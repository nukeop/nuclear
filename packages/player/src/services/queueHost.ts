import type { QueueItem, Track } from '@nuclearplayer/model';
import type {
  Queue,
  QueueHost,
  QueueItemStateUpdate,
} from '@nuclearplayer/plugin-sdk';

import { useQueueStore } from '../stores/queueStore';

export const createQueueHost = (): QueueHost => {
  return {
    getQueue: async () => {
      const state = useQueueStore.getState();
      return {
        items: state.items,
        currentIndex: state.currentIndex,
      };
    },

    getCurrentItem: async () => {
      return useQueueStore.getState().getCurrentItem();
    },

    addToQueue: async (tracks: Track[]) => {
      useQueueStore.getState().addToQueue(tracks);
    },

    addNext: async (tracks: Track[]) => {
      useQueueStore.getState().addNext(tracks);
    },

    addAt: async (tracks: Track[], index: number) => {
      useQueueStore.getState().addAt(tracks, index);
    },

    removeByIds: async (ids: string[]) => {
      useQueueStore.getState().removeByIds(ids);
    },

    removeByIndices: async (indices: number[]) => {
      useQueueStore.getState().removeByIndices(indices);
    },

    clearQueue: async () => {
      useQueueStore.getState().clearQueue();
    },

    reorder: async (fromIndex: number, toIndex: number) => {
      useQueueStore.getState().reorder(fromIndex, toIndex);
    },

    updateItemState: async (id: string, updates: QueueItemStateUpdate) => {
      useQueueStore.getState().updateItemState(id, updates);
    },

    goToNext: async () => {
      useQueueStore.getState().goToNext();
    },

    goToPrevious: async () => {
      useQueueStore.getState().goToPrevious();
    },

    goToIndex: async (index: number) => {
      useQueueStore.getState().goToIndex(index);
    },

    goToId: async (id: string) => {
      useQueueStore.getState().goToId(id);
    },

    subscribe: (listener: (queue: Queue) => void) => {
      return useQueueStore.subscribe((state) => {
        listener({
          items: state.items,
          currentIndex: state.currentIndex,
        });
      });
    },

    subscribeToCurrentItem: (
      listener: (item: QueueItem | undefined) => void,
    ) => {
      let previousItem = useQueueStore.getState().getCurrentItem();

      return useQueueStore.subscribe((state) => {
        const currentItem = state.getCurrentItem();
        if (currentItem?.id !== previousItem?.id) {
          previousItem = currentItem;
          listener(currentItem);
        }
      });
    },
  };
};

export const queueHost = createQueueHost();
