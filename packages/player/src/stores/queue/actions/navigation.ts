import { StateCreator } from 'zustand';

import type { RepeatMode } from '@nuclearplayer/model';

import { eventBus } from '../../../services/eventBus';
import { Logger } from '../../../services/logger';
import { secondsToMs } from '../../../utils/time';
import { getSetting } from '../../settingsStore';
import { useSoundStore } from '../../soundStore';
import { withPersistence } from '../persistence';
import { PlayOrder } from '../playOrder';
import type { QueueStore } from '../types';

const getActivePlayOrder = (state: QueueStore) => {
  const shuffleEnabled =
    (getSetting('core.playback.shuffle') as boolean) ?? false;
  if (shuffleEnabled) {
    return new PlayOrder(
      state.playOrder,
      state.playCursor,
      state.playNextTailId,
    );
  }
  return PlayOrder.fromQueue(state.items, state.currentIndex);
};

const getDirectionalPosition = (
  state: QueueStore,
  direction: 'next' | 'previous',
) => {
  const { items, currentIndex, playCursor } = state;
  if (items.length === 0) {
    return { currentIndex, playCursor };
  }

  const repeatMode =
    (getSetting('core.playback.repeat') as RepeatMode) ?? 'off';
  const playOrder = getActivePlayOrder(state)[direction](repeatMode);
  return {
    currentIndex: items.findIndex(
      (item) => item.id === playOrder.currentItemId,
    ),
    playCursor: playOrder.cursor,
  };
};

const emitSkip = (): void => {
  eventBus.emit('playbackSkipped', {
    positionMs: secondsToMs(useSoundStore.getState().seek),
  });
};

export const createNavigationSlice: StateCreator<
  QueueStore,
  [],
  [],
  Pick<
    QueueStore,
    | 'goToNext'
    | 'goToPrevious'
    | 'goToIndex'
    | 'goToId'
    | 'getCurrentItem'
    | 'getItemById'
  >
> = (set, get) => ({
  goToNext: withPersistence(get, () => {
    const state = get();
    const nextPosition = getDirectionalPosition(state, 'next');
    if (nextPosition.currentIndex !== state.currentIndex) {
      emitSkip();
      useSoundStore.getState().stop();
      set(nextPosition);
      Logger.queue.debug(
        `Moved to next track (index ${nextPosition.currentIndex})`,
      );
    }
  }),

  goToPrevious: withPersistence(get, () => {
    const state = get();
    const previousPosition = getDirectionalPosition(state, 'previous');
    if (previousPosition.currentIndex !== state.currentIndex) {
      emitSkip();
      useSoundStore.getState().stop();
      set(previousPosition);
      Logger.queue.debug(
        `Moved to previous track (index ${previousPosition.currentIndex})`,
      );
    }
  }),

  goToIndex: withPersistence(get, (index: number) => {
    const { items, currentIndex } = get();
    if (index >= 0 && index < items.length && index !== currentIndex) {
      emitSkip();
      useSoundStore.getState().stop();
      set({ currentIndex: index });
    }
  }),

  goToId: withPersistence(get, (id: string) => {
    const { items, currentIndex } = get();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1 && index !== currentIndex) {
      emitSkip();
      useSoundStore.getState().stop();
      set({ currentIndex: index });
    }
  }),

  getCurrentItem: () => {
    const { items, currentIndex } = get();
    return items[currentIndex];
  },

  getItemById: (id: string) => {
    return get().items.find((item) => item.id === id);
  },
});
