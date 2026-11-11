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

const getPositionAfter = (
  state: QueueStore,
  move: (
    playOrder: PlayOrder,
    repeatMode: RepeatMode,
    shuffleEnabled: boolean,
  ) => PlayOrder,
) => {
  const { items, currentIndex } = state;
  if (items.length === 0) {
    return { currentIndex };
  }

  const repeatMode =
    (getSetting('core.playback.repeat') as RepeatMode) ?? 'off';
  const shuffleEnabled =
    (getSetting('core.playback.shuffle') as boolean) ?? false;
  if (!shuffleEnabled) {
    const visibleOrder = PlayOrder.fromQueue(items, currentIndex);
    return {
      currentIndex: move(visibleOrder, repeatMode, shuffleEnabled).cursor,
    };
  }

  const playOrder = move(
    new PlayOrder(state.playOrder, state.playCursor, state.playNextTailId),
    repeatMode,
    shuffleEnabled,
  );
  return {
    currentIndex: items.findIndex(
      (item) => item.id === playOrder.currentItemId,
    ),
    playOrder: playOrder.itemIds,
    playCursor: playOrder.cursor,
    playNextTailId: playOrder.playNextTailId,
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
    const nextPosition = getPositionAfter(
      state,
      (playOrder, repeatMode, shuffleEnabled) =>
        playOrder.next(repeatMode, shuffleEnabled),
    );
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
    const previousPosition = getPositionAfter(state, (playOrder, repeatMode) =>
      playOrder.previous(repeatMode),
    );
    if (previousPosition.currentIndex !== state.currentIndex) {
      emitSkip();
      useSoundStore.getState().stop();
      set(previousPosition);
      Logger.queue.debug(
        `Moved to previous track (index ${previousPosition.currentIndex})`,
      );
    }
  }),

  goToIndex: (index: number) => {
    const { items, goToId } = get();
    const item = items[index];
    if (item) {
      goToId(item.id);
    }
  },

  goToId: withPersistence(get, (itemId: string) => {
    const state = get();
    const index = state.items.findIndex((item) => item.id === itemId);
    if (index !== -1 && index !== state.currentIndex) {
      emitSkip();
      useSoundStore.getState().stop();

      const shuffleEnabled =
        (getSetting('core.playback.shuffle') as boolean) ?? false;
      if (shuffleEnabled) {
        const playOrder = new PlayOrder(
          state.playOrder,
          state.playCursor,
          state.playNextTailId,
        ).jumpTo(itemId);
        set({
          currentIndex: index,
          playOrder: playOrder.itemIds,
          playCursor: playOrder.cursor,
        });
      } else {
        set({ currentIndex: index });
      }
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
