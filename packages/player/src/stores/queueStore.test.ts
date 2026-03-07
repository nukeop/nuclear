import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../test/utils/mockTrack';
import { initializeQueueStore, useQueueStore } from './queueStore';
import { useSettingsStore } from './settingsStore';

describe('useQueueStore', () => {
  beforeEach(() => {
    const date = new Date(2025, 1, 1);
    vi.setSystemTime(date);
    resetInMemoryTauriStore();
    useQueueStore.setState({
      items: [],
      currentIndex: 0,
      isReady: false,
      isLoading: false,
    });
    useSettingsStore.setState({ values: {} });
  });

  describe('initial state', () => {
    it('starts empty and not ready', () => {
      const state = useQueueStore.getState();
      expect(state.items).toEqual([]);
      expect(state.currentIndex).toBe(0);
      expect(state.isReady).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('addToQueue', () => {
    it('appends tracks to the end', () => {
      const tracks = [createMockTrack('Track 1'), createMockTrack('Track 2')];
      useQueueStore.getState().addToQueue(tracks);

      const state = useQueueStore.getState();
      expect(state.items).toMatchSnapshot();
    });

    it('creates items with default status and metadata', () => {
      const track = createMockTrack('Test');
      useQueueStore.getState().addToQueue([track]);

      const state = useQueueStore.getState();
      expect(state.items).toMatchSnapshot();
    });
  });

  describe('addNext', () => {
    it('inserts tracks after current index', () => {
      const initial = [
        createMockTrack('Track 1'),
        createMockTrack('Track 2'),
        createMockTrack('Track 3'),
      ];
      useQueueStore.getState().addToQueue(initial);
      useQueueStore.setState({ currentIndex: 1 });

      useQueueStore.getState().addNext([createMockTrack('New Track')]);

      const state = useQueueStore.getState();
      expect(state.items).toHaveLength(4);
      expect(state.items[2].track.title).toBe('New Track');
      expect(state.items[3].track.title).toBe('Track 3');
    });
  });

  describe('addAt', () => {
    it('inserts tracks at specified index', () => {
      useQueueStore
        .getState()
        .addToQueue([createMockTrack('A'), createMockTrack('C')]);

      useQueueStore.getState().addAt([createMockTrack('B')], 1);

      const titles = useQueueStore
        .getState()
        .items.map((item) => item.track.title);
      expect(titles).toEqual(['A', 'B', 'C']);
    });

    it('adjusts currentIndex when inserting before it', () => {
      useQueueStore
        .getState()
        .addToQueue([
          createMockTrack('A'),
          createMockTrack('B'),
          createMockTrack('C'),
        ]);
      useQueueStore.setState({ currentIndex: 2 });

      useQueueStore.getState().addAt([createMockTrack('X')], 1);

      expect(useQueueStore.getState().currentIndex).toBe(3);
    });
  });

  describe('removeByIds', () => {
    it('removes items by their IDs', () => {
      useQueueStore
        .getState()
        .addToQueue([
          createMockTrack('A'),
          createMockTrack('B'),
          createMockTrack('C'),
        ]);
      const ids = useQueueStore.getState().items.map((item) => item.id);

      useQueueStore.getState().removeByIds([ids[1]]);

      const state = useQueueStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].track.title).toBe('A');
      expect(state.items[1].track.title).toBe('C');
    });

    it('adjusts currentIndex when removing items before it', () => {
      useQueueStore
        .getState()
        .addToQueue([
          createMockTrack('A'),
          createMockTrack('B'),
          createMockTrack('C'),
        ]);
      useQueueStore.setState({ currentIndex: 2 });
      const ids = useQueueStore.getState().items.map((item) => item.id);

      useQueueStore.getState().removeByIds([ids[0], ids[1]]);

      expect(useQueueStore.getState().currentIndex).toBe(0);
    });
  });

  describe('removeByIndices', () => {
    it('removes items by their indices', () => {
      useQueueStore
        .getState()
        .addToQueue([
          createMockTrack('A'),
          createMockTrack('B'),
          createMockTrack('C'),
        ]);

      useQueueStore.getState().removeByIndices([0, 2]);

      const state = useQueueStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].track.title).toBe('B');
    });
  });

  describe('clearQueue', () => {
    it('removes all items and resets index', () => {
      useQueueStore
        .getState()
        .addToQueue([createMockTrack('A'), createMockTrack('B')]);
      useQueueStore.setState({ currentIndex: 1 });

      useQueueStore.getState().clearQueue();

      const state = useQueueStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.currentIndex).toBe(0);
    });
  });

  describe('reorder', () => {
    it('moves item from one position to another and updates the current index', () => {
      useQueueStore
        .getState()
        .addToQueue([
          createMockTrack('A'),
          createMockTrack('B'),
          createMockTrack('C'),
        ]);

      useQueueStore.getState().reorder(0, 2);

      const titles = useQueueStore
        .getState()
        .items.map((item) => item.track.title);
      expect(titles).toEqual(['B', 'C', 'A']);
      expect(useQueueStore.getState().currentIndex).toBe(2);
    });

    it('adjusts currentIndex when moving item across it', () => {
      useQueueStore
        .getState()
        .addToQueue([
          createMockTrack('A'),
          createMockTrack('B'),
          createMockTrack('C'),
        ]);
      useQueueStore.setState({ currentIndex: 1 });

      useQueueStore.getState().reorder(0, 2);

      expect(useQueueStore.getState().currentIndex).toBe(0);
    });
  });

  describe('updateItemState', () => {
    it('updates specific item properties', () => {
      useQueueStore.getState().addToQueue([createMockTrack('Track')]);
      const itemId = useQueueStore.getState().items[0].id;

      useQueueStore.getState().updateItemState(itemId, {
        status: 'loading',
      });

      const item = useQueueStore.getState().items[0];
      expect(item.status).toBe('loading');
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      useQueueStore
        .getState()
        .addToQueue([
          createMockTrack('Track 1'),
          createMockTrack('Track 2'),
          createMockTrack('Track 3'),
        ]);
    });

    it('goToNext increments currentIndex', () => {
      useQueueStore.getState().goToNext();
      expect(useQueueStore.getState().currentIndex).toBe(1);
    });

    it('goToNext stops at end of queue', () => {
      useQueueStore.setState({ currentIndex: 2 });
      useQueueStore.getState().goToNext();
      expect(useQueueStore.getState().currentIndex).toBe(2);
    });

    it('goToPrevious decrements currentIndex', () => {
      useQueueStore.setState({ currentIndex: 2 });
      useQueueStore.getState().goToPrevious();
      expect(useQueueStore.getState().currentIndex).toBe(1);
    });

    it('goToPrevious stops at start of queue', () => {
      useQueueStore.getState().goToPrevious();
      expect(useQueueStore.getState().currentIndex).toBe(0);
    });

    it('goToIndex sets currentIndex to valid position', () => {
      useQueueStore.getState().goToIndex(2);
      expect(useQueueStore.getState().currentIndex).toBe(2);
    });

    it('goToIndex ignores out-of-bounds values', () => {
      useQueueStore.getState().goToIndex(10);
      expect(useQueueStore.getState().currentIndex).toBe(0);
    });

    it('goToId finds and navigates to item by ID', () => {
      const items = useQueueStore.getState().items;
      useQueueStore.getState().goToId(items[2].id);
      expect(useQueueStore.getState().currentIndex).toBe(2);
    });

    it('getCurrentItem returns the current queue item', () => {
      useQueueStore.setState({ currentIndex: 1 });
      const current = useQueueStore.getState().getCurrentItem();
      expect(current?.track.title).toBe('Track 2');
    });

    it('goToNext wraps to start when repeat mode is all', () => {
      useQueueStore.setState({ currentIndex: 2 });
      useSettingsStore.setState({ values: { 'core.playback.repeat': 'all' } });
      useQueueStore.getState().goToNext();
      expect(useQueueStore.getState().currentIndex).toBe(0);
    });

    it('goToPrevious wraps to end when repeat mode is all', () => {
      useSettingsStore.setState({ values: { 'core.playback.repeat': 'all' } });
      useQueueStore.getState().goToPrevious();
      expect(useQueueStore.getState().currentIndex).toBe(2);
    });

    it('goToNext picks a different random index when shuffle is enabled', () => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9);
      useSettingsStore.setState({ values: { 'core.playback.shuffle': true } });
      useQueueStore.getState().goToNext();
      expect(useQueueStore.getState().currentIndex).toBe(2);
      randomSpy.mockRestore();
    });

    it('goToNext retries random selection until index changes', () => {
      const randomSpy = vi
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.8);
      useSettingsStore.setState({ values: { 'core.playback.shuffle': true } });
      useQueueStore.getState().goToNext();
      expect(useQueueStore.getState().currentIndex).toBe(2);
      expect(randomSpy).toHaveBeenCalledTimes(2);
      randomSpy.mockRestore();
    });

    it('goToPrevious picks a different random index when shuffle is enabled', () => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.4);
      useSettingsStore.setState({ values: { 'core.playback.shuffle': true } });
      useQueueStore.setState({ currentIndex: 2 });
      useQueueStore.getState().goToPrevious();
      expect(useQueueStore.getState().currentIndex).toBe(1);
      randomSpy.mockRestore();
    });
  });

  describe('persistence', () => {
    it('initializeQueueStore restores state from storage', async () => {
      const tracks = [createMockTrack('Track 1'), createMockTrack('Track 2')];
      useQueueStore.getState().addToQueue(tracks);
      useQueueStore.getState().goToIndex(1);

      await new Promise((resolve) => setTimeout(resolve, 10));

      useQueueStore.setState({
        items: [],
        currentIndex: 0,
        isReady: false,
        isLoading: false,
      });

      await initializeQueueStore();

      const state = useQueueStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.currentIndex).toBe(1);
      expect(state.isReady).toBe(true);
    });

    it('sanitizes out-of-bounds currentIndex on load', async () => {
      useQueueStore.getState().addToQueue([createMockTrack('Track 1')]);
      useQueueStore.setState({ currentIndex: 5 });

      useQueueStore.setState({
        items: [],
        currentIndex: 0,
        isReady: false,
        isLoading: false,
      });

      await initializeQueueStore();

      expect(useQueueStore.getState().currentIndex).toBe(0);
    });
  });
});
