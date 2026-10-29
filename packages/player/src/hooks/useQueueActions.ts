import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

import type { Track } from '@nuclearplayer/model';

import { playbackManager } from '../services/playback';
import { useQueueStore } from '../stores/queueStore';

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
    selectCandidate,
    goToNext,
    goToPrevious,
    goToIndex,
    goToId,
  } = useQueueStore(
    useShallow((state) => ({
      addToQueue: state.addToQueue,
      addNext: state.addNext,
      addAt: state.addAt,
      removeByIds: state.removeByIds,
      removeByIndices: state.removeByIndices,
      clearQueue: state.clearQueue,
      reorder: state.reorder,
      updateItemState: state.updateItemState,
      selectCandidate: state.selectCandidate,
      goToNext: state.goToNext,
      goToPrevious: state.goToPrevious,
      goToIndex: state.goToIndex,
      goToId: state.goToId,
    })),
  );

  const playNow = useCallback(
    (track: Track) => {
      clearQueue();
      addToQueue([track]);
    },
    [clearQueue, addToQueue],
  );

  const playTracks = useCallback(
    (tracks: Track[]) => {
      clearQueue();
      addToQueue(tracks);
      playbackManager.play();
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
    selectCandidate,
    goToNext,
    goToPrevious,
    goToIndex,
    goToId,
    playNow,
    playTracks,
  };
};
