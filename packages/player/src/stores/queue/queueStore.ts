import { create } from 'zustand';

import { useSettingsStore } from '../settingsStore';
import { createCandidatesSlice } from './actions/candidates';
import { createEditingSlice } from './actions/editing';
import { createNavigationSlice } from './actions/navigation';
import { createPersistenceSlice } from './persistence';
import { PlayOrder } from './playOrder';
import type { QueueStore } from './types';

export const useQueueStore = create<QueueStore>()((...args) => ({
  items: [],
  currentIndex: 0,
  playOrder: [],
  playCursor: 0,
  playNextTailId: null,
  isReady: false,
  isLoading: false,
  ...createPersistenceSlice(...args),
  ...createEditingSlice(...args),
  ...createCandidatesSlice(...args),
  ...createNavigationSlice(...args),
}));

useSettingsStore.subscribe((settings, previousSettings) => {
  const shuffleEnabled = settings.values['core.playback.shuffle'];
  if (shuffleEnabled === previousSettings.values['core.playback.shuffle']) {
    return;
  }
  if (shuffleEnabled) {
    const { items, currentIndex } = useQueueStore.getState();
    const playOrder = PlayOrder.fromQueue(items, currentIndex).shuffle();
    useQueueStore.setState({
      playOrder: playOrder.ids,
      playCursor: playOrder.cursor,
      playNextTailId: playOrder.playNextTailId,
    });
    return;
  }
  useQueueStore.setState({
    playOrder: [],
    playCursor: 0,
    playNextTailId: null,
  });
});

export const initializeQueueStore = async (): Promise<void> => {
  await useQueueStore.getState().loadFromDisk();
};
