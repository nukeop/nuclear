import { LazyStore } from '@tauri-apps/plugin-store';
import shuffle from 'lodash-es/shuffle';
import { expect, vi } from 'vitest';

import { createMockTrack } from '../../test/utils/mockTrack';
import { mockUuid } from '../../test/utils/mockUuid';
import { useSettingsStore } from '../settingsStore';
import { queueSaved } from './persistence';
import { initializeQueueStore, useQueueStore } from './queueStore';

const tracksWithTitlesAsIds = (titles: string[]) => {
  mockUuid.willReturn(...titles);
  return titles.map((title) => createMockTrack(title));
};

export const QueueWrapper = {
  addTracks(...titles: string[]) {
    useQueueStore.getState().addToQueue(tracksWithTitlesAsIds(titles));
    return useQueueStore.getState().items.map((item) => item.id);
  },

  addTracksAt(index: number, ...titles: string[]) {
    useQueueStore.getState().addAt(tracksWithTitlesAsIds(titles), index);
  },

  playNext(...titles: string[]) {
    useQueueStore.getState().addNext(tracksWithTitlesAsIds(titles));
  },

  get titles() {
    return useQueueStore.getState().items.map((item) => item.track.title);
  },

  get currentTitle() {
    return useQueueStore.getState().getCurrentItem()?.track.title;
  },

  skip(steps: number) {
    return Array.from({ length: steps }, () => {
      useQueueStore.getState().goToNext();
      return QueueWrapper.currentTitle;
    });
  },

  goBack(steps: number) {
    return Array.from({ length: steps }, () => {
      useQueueStore.getState().goToPrevious();
      return QueueWrapper.currentTitle;
    });
  },

  shuffleWillReturn(...titles: string[]) {
    vi.mocked<(ids: string[]) => string[]>(shuffle).mockImplementationOnce(
      (ids) => {
        expect(new Set(ids)).toEqual(new Set(titles));
        return titles;
      },
    );
  },

  async saveQueueFileWithoutPlayOrder(currentIndex: number) {
    await queueSaved();
    const queueFile = new LazyStore('queue.json');
    await queueFile.clear();
    await queueFile.set('queue.items', useQueueStore.getState().items);
    await queueFile.set('queue.currentIndex', currentIndex);
  },

  async restart() {
    await queueSaved();
    useQueueStore.setState(useQueueStore.getInitialState());
    useSettingsStore.setState({ values: {} });
    await useSettingsStore.getState().loadFromDisk();
    await initializeQueueStore();
  },
};
