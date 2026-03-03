import { useCallback } from 'react';

import type { Track } from '@nuclearplayer/model';

import { useQueueStore } from '../stores/queueStore';

// You can't replace this with lodash pick because it causes infinite re-renders
export const useQueueActions = () => {
  const {
    addToQueue,
    addNext,
    addAt,
    removeByIds,
    removeByIndices,
    clearQueue,
    reorder,
    updateItemState,
    goToNext,
    goToPrevious,
    goToIndex,
    goToId,
    setRepeatMode,
    setShuffleEnabled,
  } = useQueueStore();

  const playNow = useCallback(
    (track: Track) => {
      clearQueue();
      addToQueue([track]);
    },
    [clearQueue, addToQueue],
  );

  return {
    addToQueue,
    addNext,
    addAt,
    removeByIds,
    removeByIndices,
    clearQueue,
    reorder,
    updateItemState,
    goToNext,
    goToPrevious,
    goToIndex,
    goToId,
    setRepeatMode,
    setShuffleEnabled,
    playNow,
  };
};
