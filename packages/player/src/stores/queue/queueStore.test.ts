import shuffle from 'lodash-es/shuffle';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockCandidate } from '../../test/builders/StreamingProviderBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../../test/utils/mockTrack';
import { setSetting, useSettingsStore } from '../settingsStore';
import { useSoundStore } from '../soundStore';
import { useQueueStore } from './queueStore';
import { QueueWrapper as Wrapper } from './queueStore.test-wrapper';

vi.mock('lodash-es/shuffle', () => ({
  default: vi.fn(<T>(list: T[]) => list),
}));

describe('useQueueStore', () => {
  beforeEach(() => {
    const date = new Date(2025, 1, 1);
    vi.setSystemTime(date);
    resetInMemoryTauriStore();
    useQueueStore.setState(useQueueStore.getInitialState());
    useSettingsStore.setState({ values: {} });
    vi.mocked(shuffle).mockReset();
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

  describe('moveBefore', () => {
    it('moves an item in front of another item', () => {
      const [idA, , idC] = Wrapper.addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idC, idA);

      expect(Wrapper.titles).toEqual(['C', 'A', 'B']);
    });

    it('moves an item to the end when there is no item to move it before', () => {
      const [idA] = Wrapper.addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idA, null);

      expect(Wrapper.titles).toEqual(['B', 'C', 'A']);
    });

    it('keeps the current item current when other items move around it', () => {
      const [idA, idB] = Wrapper.addTracks('A', 'B', 'C');
      useQueueStore.setState({ currentIndex: 1 });

      useQueueStore.getState().moveBefore(idA, null);

      expect(useQueueStore.getState().getCurrentItem()?.id).toBe(idB);
    });

    it('keeps the current item current when it is the item that moves', () => {
      const [idA, , idC] = Wrapper.addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idA, idC);

      expect(Wrapper.titles).toEqual(['B', 'A', 'C']);
      expect(useQueueStore.getState().getCurrentItem()?.id).toBe(idA);
    });

    it('leaves the queue unchanged when the item to move is not in the queue', () => {
      const [idA] = Wrapper.addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore('missing', idA);

      expect(Wrapper.titles).toEqual(['A', 'B', 'C']);
    });

    it('moves an item to the end when the item to move it before is not in the queue', () => {
      const [idA] = Wrapper.addTracks('A', 'B', 'C');

      useQueueStore.getState().moveBefore(idA, 'missing');

      expect(Wrapper.titles).toEqual(['B', 'C', 'A']);
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
    beforeEach(() => {
      Wrapper.addTracks('A', 'B', 'C', 'D', 'E');
    });

    it('keeps the current item when shuffle is turned on', async () => {
      useQueueStore.getState().goToIndex(2);

      await setSetting('core.playback.shuffle', true);

      expect(Wrapper.currentTitle).toBe('C');
    });

    it('plays each item one time before the end', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);

      expect(Wrapper.skip(4)).toEqual(['C', 'E', 'B', 'D']);
      expect(Wrapper.skip(1)).toEqual(['D']);
    });

    it('goes back through the items that played, in reverse', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(4);

      expect(Wrapper.goBack(4)).toEqual(['B', 'E', 'C', 'A']);
    });

    it('keeps the current item on previous from the first item with repeat off', async () => {
      useQueueStore.getState().goToIndex(2);
      await setSetting('core.playback.shuffle', true);

      expect(Wrapper.goBack(1)).toEqual(['C']);
    });

    it('goes to the last item of the play order on previous from the first item with repeat all', async () => {
      await setSetting('core.playback.repeat', 'all');
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);

      expect(Wrapper.goBack(1)).toEqual(['D']);
    });

    it('plays the items in the visible order after shuffle is turned off', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      await setSetting('core.playback.shuffle', false);

      expect(Wrapper.skip(2)).toEqual(['D', 'E']);
    });

    it('continues the play order where it stopped after a restart', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(2);

      await Wrapper.restart();

      expect(Wrapper.currentTitle).toBe('E');
      expect(Wrapper.skip(2)).toEqual(['B', 'D']);
    });

    it('makes a shuffled play order for a saved queue without one, and keeps the current item', async () => {
      await setSetting('core.playback.shuffle', true);
      await Wrapper.saveQueueFileWithoutPlayOrder(2);
      Wrapper.shuffleWillReturn('E', 'A', 'D', 'B');

      await Wrapper.restart();

      expect(Wrapper.currentTitle).toBe('C');
      expect(Wrapper.skip(4)).toEqual(['E', 'A', 'D', 'B']);
    });

    it('shuffles added tracks into the items that did not play yet', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      Wrapper.shuffleWillReturn('F', 'D', 'E', 'G', 'B');
      Wrapper.addTracks('F', 'G');

      expect(Wrapper.skip(5)).toEqual(['F', 'D', 'E', 'G', 'B']);
    });

    it('plays tracks from play next directly after the current item, in the sequence they were added', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      Wrapper.playNext('F', 'G');

      expect(Wrapper.skip(4)).toEqual(['F', 'G', 'E', 'B']);
    });

    it('plays the latest play next tracks first', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      Wrapper.playNext('F');
      Wrapper.playNext('G');

      expect(Wrapper.skip(4)).toEqual(['G', 'F', 'E', 'B']);
    });

    it('keeps play next tracks directly after the current item when the user adds more tracks', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);
      Wrapper.playNext('F');
      Wrapper.playNext('G');

      Wrapper.shuffleWillReturn('H', 'D', 'E', 'B');
      Wrapper.addTracks('H');

      expect(Wrapper.skip(6)).toEqual(['G', 'F', 'H', 'D', 'E', 'B']);
    });

    it('shuffles tracks added at a position in the visible queue into the items that did not play yet', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      Wrapper.shuffleWillReturn('D', 'G', 'B', 'F', 'E');
      Wrapper.addTracksAt(0, 'F', 'G');

      expect(Wrapper.skip(5)).toEqual(['D', 'G', 'B', 'F', 'E']);
    });

    it('makes the first track added to an empty queue the current item', async () => {
      useQueueStore.getState().clearQueue();
      await setSetting('core.playback.shuffle', true);

      Wrapper.shuffleWillReturn('H', 'G');
      Wrapper.addTracks('F', 'G', 'H');

      expect(Wrapper.currentTitle).toBe('F');
      expect(Wrapper.skip(2)).toEqual(['H', 'G']);
    });

    it('does not play a removed item', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);

      useQueueStore.getState().removeByIds(['E']);

      expect(Wrapper.skip(3)).toEqual(['C', 'B', 'D']);
    });

    it('does not play an item removed by its position in the visible queue', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);

      useQueueStore.getState().removeByIndices([4]);

      expect(Wrapper.skip(3)).toEqual(['C', 'B', 'D']);
    });

    it('continues the play order when the user removes an item that played before', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(2);

      useQueueStore.getState().removeByIds(['C']);

      expect(Wrapper.currentTitle).toBe('E');
      expect(Wrapper.skip(2)).toEqual(['B', 'D']);
    });

    it('makes the next item of the play order current when the user removes the current item', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      useQueueStore.getState().removeByIds(['C']);

      expect(Wrapper.currentTitle).toBe('E');
      expect(Wrapper.skip(2)).toEqual(['B', 'D']);
    });

    it('makes the item before it current when the user removes the current item at the end of the play order', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(4);

      useQueueStore.getState().removeByIds(['D']);

      expect(Wrapper.currentTitle).toBe('B');
    });

    it('makes the next added track the current item after the user removes all items', async () => {
      await setSetting('core.playback.shuffle', true);
      useQueueStore.getState().removeByIds(['A', 'B', 'C', 'D', 'E']);

      Wrapper.shuffleWillReturn('H', 'G');
      Wrapper.addTracks('F', 'G', 'H');

      expect(Wrapper.currentTitle).toBe('F');
      expect(Wrapper.skip(2)).toEqual(['H', 'G']);
    });

    it('makes the next added track the current item after the user clears the queue', async () => {
      await setSetting('core.playback.shuffle', true);
      useQueueStore.getState().clearQueue();

      Wrapper.shuffleWillReturn('H', 'G');
      Wrapper.addTracks('F', 'G', 'H');

      expect(Wrapper.currentTitle).toBe('F');
      expect(Wrapper.skip(2)).toEqual(['H', 'G']);
    });

    it('plays the item the user jumps to, then the items that did not play yet in their sequence', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      useQueueStore.getState().goToId('B');

      expect(Wrapper.currentTitle).toBe('B');
      expect(Wrapper.skip(2)).toEqual(['E', 'D']);
    });

    it('jumps to an item by its position in the visible queue', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      useQueueStore.getState().goToIndex(1);

      expect(Wrapper.currentTitle).toBe('B');
      expect(Wrapper.skip(2)).toEqual(['E', 'D']);
    });

    it('goes back to the item that played before the jump on previous', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(1);

      useQueueStore.getState().goToId('B');

      expect(Wrapper.goBack(2)).toEqual(['C', 'A']);
    });

    it('continues the play order after the user jumps to an item that played before', async () => {
      Wrapper.shuffleWillReturn('C', 'E', 'B', 'D');
      await setSetting('core.playback.shuffle', true);
      Wrapper.skip(2);

      useQueueStore.getState().goToId('A');

      expect(Wrapper.currentTitle).toBe('A');
      expect(Wrapper.skip(2)).toEqual(['B', 'D']);
    });
  });

  describe('persistence', () => {
    it('initializeQueueStore restores state from storage', async () => {
      Wrapper.addTracks('A', 'B');
      useQueueStore.getState().goToIndex(1);

      await Wrapper.restart();

      expect(Wrapper.titles).toEqual(['A', 'B']);
      expect(Wrapper.currentTitle).toBe('B');
      expect(useQueueStore.getState().isReady).toBe(true);
    });

    it('sanitizes out-of-bounds currentIndex on load', async () => {
      Wrapper.addTracks('A');
      await Wrapper.saveQueueFileWithoutPlayOrder(5);

      await Wrapper.restart();

      expect(useQueueStore.getState().currentIndex).toBe(0);
    });
  });
});
