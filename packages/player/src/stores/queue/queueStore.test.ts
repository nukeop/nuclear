import { LazyStore } from '@tauri-apps/plugin-store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockCandidate } from '../../test/builders/StreamingProviderBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../../test/utils/mockTrack';
import { setSetting, useSettingsStore } from '../settingsStore';
import { useSoundStore } from '../soundStore';
import { initializeQueueStore, useQueueStore } from './queueStore';

describe('useQueueStore', () => {
  beforeEach(() => {
    const date = new Date(2025, 1, 1);
    vi.setSystemTime(date);
    resetInMemoryTauriStore();
    useQueueStore.setState({
      items: [],
      currentIndex: 0,
      playOrder: [],
      playCursor: 0,
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

  const addTracks = (...titles: string[]) => {
    useQueueStore
      .getState()
      .addToQueue(titles.map((title) => createMockTrack(title)));
    return useQueueStore.getState().items.map((item) => item.id);
  };

  describe('moveBefore', () => {
    const titles = () =>
      useQueueStore.getState().items.map((item) => item.track.title);

    it('moves an item in front of another item', () => {
      const [idA, , idC] = addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idC, idA);

      expect(titles()).toEqual(['C', 'A', 'B']);
    });

    it('moves an item to the end when there is no item to move it before', () => {
      const [idA] = addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idA, null);

      expect(titles()).toEqual(['B', 'C', 'A']);
    });

    it('keeps the current item current when other items move around it', () => {
      const [idA, idB] = addTracks('A', 'B', 'C');
      useQueueStore.setState({ currentIndex: 1 });

      useQueueStore.getState().moveBefore(idA, null);

      expect(useQueueStore.getState().getCurrentItem()?.id).toBe(idB);
    });

    it('keeps the current item current when it is the item that moves', () => {
      const [idA, , idC] = addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idA, idC);

      expect(titles()).toEqual(['B', 'A', 'C']);
      expect(useQueueStore.getState().getCurrentItem()?.id).toBe(idA);
    });

    it('leaves the queue unchanged when the item to move is not in the queue', () => {
      const [idA] = addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore('missing', idA);

      expect(titles()).toEqual(['A', 'B', 'C']);
    });

    it('moves an item to the end when the item to move it before is not in the queue', () => {
      const [idA] = addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idA, 'missing');

      expect(titles()).toEqual(['B', 'C', 'A']);
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

  describe('updateCandidate', () => {
    it('does nothing when the item is no longer in the queue', () => {
      useQueueStore.getState().addToQueue([createMockTrack('Track')]);
      const stateBefore = useQueueStore.getState();

      useQueueStore
        .getState()
        .updateCandidate('missing-id', createMockCandidate('c1', 'Stream 1'));

      expect(useQueueStore.getState()).toEqual(stateBefore);
    });
  });

  describe('removeCandidate', () => {
    it('removes the matching candidate from the item', () => {
      useQueueStore.getState().addToQueue([createMockTrack('Track')]);
      const itemId = useQueueStore.getState().items[0].id;
      useQueueStore.getState().updateItemState(itemId, {
        track: {
          ...useQueueStore.getState().items[0].track,
          streamCandidates: [
            createMockCandidate('c1', 'Stream 1'),
            createMockCandidate('c2', 'Stream 2'),
          ],
        },
      });

      useQueueStore.getState().removeCandidate(itemId, 'c1');

      const item = useQueueStore.getState().items[0];
      expect(item.track.streamCandidates).toEqual([
        createMockCandidate('c2', 'Stream 2'),
      ]);
    });

    it('does nothing when the item is no longer in the queue', () => {
      useQueueStore.getState().addToQueue([createMockTrack('Track')]);
      const stateBefore = useQueueStore.getState();

      useQueueStore.getState().removeCandidate('missing-id', 'c1');

      expect(useQueueStore.getState()).toEqual(stateBefore);
    });
  });

  describe('selectCandidate', () => {
    it('does nothing when the item is no longer in the queue', () => {
      useQueueStore.getState().addToQueue([createMockTrack('Track')]);
      const stateBefore = useQueueStore.getState();

      useQueueStore.getState().selectCandidate('missing-id', 'c1');

      expect(useQueueStore.getState()).toEqual(stateBefore);
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

    it('goToIndex to the current index does not stop playback', () => {
      useSoundStore.setState({ status: 'playing' });
      useQueueStore.getState().goToIndex(0);
      expect(useSoundStore.getState().status).toBe('playing');
    });

    it('goToId with the current item id does not stop playback', () => {
      useSoundStore.setState({ status: 'playing' });
      const items = useQueueStore.getState().items;
      useQueueStore.getState().goToId(items[0].id);
      expect(useSoundStore.getState().status).toBe('playing');
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
  });

  describe('shuffle', () => {
    const TITLES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const currentTitle = () =>
      useQueueStore.getState().getCurrentItem()?.track.title;

    const playThrough = () => [
      currentTitle(),
      ...Array.from({ length: TITLES.length - 1 }, () => {
        useQueueStore.getState().goToNext();
        return currentTitle();
      }),
    ];

    const goBack = (steps: number) =>
      Array.from({ length: steps }, () => {
        useQueueStore.getState().goToPrevious();
        return currentTitle();
      });

    const waitForSave = () => new Promise((resolve) => setTimeout(resolve, 10));

    const restart = async () => {
      await waitForSave();
      useQueueStore.setState({
        items: [],
        currentIndex: 0,
        playOrder: [],
        playCursor: 0,
        isReady: false,
        isLoading: false,
      });
      useSettingsStore.setState({ values: {} });
      await useSettingsStore.getState().loadFromDisk();
      await initializeQueueStore();
    };

    beforeEach(() => {
      addTracks(...TITLES);
    });

    it('keeps the current item when shuffle is turned on', async () => {
      useQueueStore.getState().goToIndex(4);

      await setSetting('core.playback.shuffle', true);

      expect(currentTitle()).toBe('E');
    });

    it('plays each item one time before the end', async () => {
      await setSetting('core.playback.shuffle', true);

      const played = playThrough();
      useQueueStore.getState().goToNext();

      expect([...played].sort()).toEqual(TITLES);
      expect(currentTitle()).toBe(played.at(-1));
    });

    it('goes back through the items that played, in reverse', async () => {
      await setSetting('core.playback.shuffle', true);

      const played = playThrough();
      const playedBack = goBack(TITLES.length - 1);

      expect(playedBack).toEqual(played.slice(0, -1).reverse());
    });

    it('keeps the current item on previous from the first item with repeat off', async () => {
      useQueueStore.getState().goToIndex(4);
      await setSetting('core.playback.shuffle', true);

      useQueueStore.getState().goToPrevious();

      expect(currentTitle()).toBe('E');
    });

    it('goes to the last item of the play order on previous from the first item with repeat all', async () => {
      useQueueStore.getState().goToIndex(9);
      await setSetting('core.playback.repeat', 'all');
      await setSetting('core.playback.shuffle', true);

      const played = playThrough();
      goBack(TITLES.length - 1);
      useQueueStore.getState().goToPrevious();

      expect(currentTitle()).toBe(played.at(-1));
    });

    it('plays the items in the visible order after shuffle is turned off', async () => {
      await setSetting('core.playback.repeat', 'all');
      await setSetting('core.playback.shuffle', true);
      useQueueStore.getState().goToNext();
      useQueueStore.getState().goToNext();
      const start = TITLES.indexOf(currentTitle()!);

      await setSetting('core.playback.shuffle', false);
      const played = playThrough();

      expect(played).toEqual([
        ...TITLES.slice(start),
        ...TITLES.slice(0, start),
      ]);
    });

    it('continues the play order where it stopped after a restart', async () => {
      await setSetting('core.playback.shuffle', true);
      const played = playThrough();
      goBack(6);

      await restart();

      expect(currentTitle()).toBe(played[3]);
      expect(goBack(3)).toEqual([played[2], played[1], played[0]]);
    });

    it('makes a random play order for a saved queue without one, and keeps the current item', async () => {
      const { items } = useQueueStore.getState();
      await setSetting('core.playback.shuffle', true);
      await waitForSave();
      const queueFile = new LazyStore('queue.json');
      await queueFile.clear();
      await queueFile.set('queue.items', items);
      await queueFile.set('queue.currentIndex', 4);

      await restart();

      expect(currentTitle()).toBe('E');
      expect(playThrough().sort()).toEqual(TITLES);
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
