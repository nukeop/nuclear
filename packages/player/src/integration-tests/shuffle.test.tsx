import shuffle from 'lodash-es/shuffle';

import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queue/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { MetadataProviderBuilder } from '../test/builders/MetadataProviderBuilder';
import { createQueueItem } from '../test/fixtures/queue';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { mockUuid } from '../test/utils/mockUuid';
import { AlbumWrapper } from '../views/Album/Album.test-wrapper';
import { PlayerBarWrapper } from './PlayerBar.test-wrapper';
import { QueueWrapper } from './Queue.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

vi.mock('lodash-es/shuffle', () => ({
  default: vi.fn(<T,>(list: T[]) => list),
}));

const shuffleWillReturn = (...itemIds: string[]) => {
  vi.mocked<(itemIds: string[]) => string[]>(shuffle).mockImplementationOnce(
    (receivedItemIds) => {
      expect(new Set(receivedItemIds)).toEqual(new Set(itemIds));
      return itemIds;
    },
  );
};

describe('Shuffle', () => {
  beforeEach(async () => {
    resetInMemoryTauriStore();
    mockUuid.reset();
    vi.mocked(shuffle).mockReset();
    useSettingsStore.setState({ values: {} });
    providersHost.clear();
    providersHost.register(
      MetadataProviderBuilder.albumDetailsProvider().build(),
    );
    useQueueStore.setState(useQueueStore.getInitialState());
    QueueWrapper.initQueue(
      ['A', 'B', 'C', 'D', 'E'].map((title) => ({
        ...createQueueItem(title),
        id: title,
      })),
    );
    await AlbumWrapper.mountDirectly();
  });

  it('keeps the current item when shuffle is turned on', async () => {
    await QueueWrapper.selectItem('C');

    await PlayerBarWrapper.shuffleButton.click();

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
  });

  it('plays each item one time before the end', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('goes back through the items that played, in reverse', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();

    await PlayerBarWrapper.previousButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.previousButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.previousButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
    await PlayerBarWrapper.previousButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('A');
  });

  it('keeps the current item on previous from the first item with repeat off', async () => {
    await QueueWrapper.selectItem('C');
    await PlayerBarWrapper.shuffleButton.click();

    await PlayerBarWrapper.previousButton.click();

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
  });

  it('goes to the last item of the play order on previous from the first item with repeat all', async () => {
    await PlayerBarWrapper.repeatButton.click();
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();

    await PlayerBarWrapper.previousButton.click();

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('plays the items in the visible order after shuffle is turned off', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();

    await PlayerBarWrapper.shuffleButton.click();

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
  });

  it('shuffles an added track into the items that did not play yet', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();

    mockUuid.willReturn('Countdown');
    shuffleWillReturn('D', 'Countdown', 'B', 'E');
    await AlbumWrapper.addTrackToQueueByTitle('Countdown');

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
  });

  it('plays a track from play next directly after the current item', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();

    mockUuid.willReturn('Countdown');
    await AlbumWrapper.playTrackNextViaContextMenu('Countdown');

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
  });

  it('plays the latest play next track first', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();

    mockUuid.willReturn('Countdown', 'Spiral');
    await AlbumWrapper.playTrackNextViaContextMenu('Countdown');
    await AlbumWrapper.playTrackNextViaContextMenu('Spiral');

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Spiral');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
  });

  it('keeps play next tracks directly after the current item when the user adds more tracks', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();
    mockUuid.willReturn('Countdown', 'Spiral', 'Giant Steps');
    await AlbumWrapper.playTrackNextViaContextMenu('Countdown');
    await AlbumWrapper.playTrackNextViaContextMenu('Spiral');

    shuffleWillReturn('Giant Steps', 'D', 'E', 'B');
    await AlbumWrapper.addTrackToQueueByTitle('Giant Steps');

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Spiral');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Giant Steps');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
  });

  it('makes the first track added to an empty queue the current item', async () => {
    await QueueWrapper.clearButton.click();
    await PlayerBarWrapper.shuffleButton.click();

    mockUuid.willReturn('Countdown', 'Giant Steps', 'Spiral');
    shuffleWillReturn('Spiral', 'Giant Steps');
    await AlbumWrapper.addAllTracksToQueue();

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Spiral');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Giant Steps');
  });

  it('does not play a removed item', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();

    await QueueWrapper.removeItemByTitle('E');

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('continues the play order when the user removes an item that played before', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();

    await QueueWrapper.removeItemByTitle('C');

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('makes the next item of the play order current when the user removes the current item', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();

    await QueueWrapper.removeItemByTitle('C');

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('makes the item before it current when the user removes the current item at the end of the play order', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();

    await QueueWrapper.removeItemByTitle('D');

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
  });

  it('makes the next added track the current item after the user removes all items', async () => {
    await PlayerBarWrapper.shuffleButton.click();
    await QueueWrapper.removeItemByTitle('A');
    await QueueWrapper.removeItemByTitle('B');
    await QueueWrapper.removeItemByTitle('C');
    await QueueWrapper.removeItemByTitle('D');
    await QueueWrapper.removeItemByTitle('E');

    mockUuid.willReturn('Countdown', 'Giant Steps', 'Spiral');
    shuffleWillReturn('Spiral', 'Giant Steps');
    await AlbumWrapper.addAllTracksToQueue();

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Spiral');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Giant Steps');
  });

  it('makes the next added track the current item after the user clears the queue', async () => {
    await PlayerBarWrapper.shuffleButton.click();
    await QueueWrapper.clearButton.click();

    mockUuid.willReturn('Countdown', 'Giant Steps', 'Spiral');
    shuffleWillReturn('Spiral', 'Giant Steps');
    await AlbumWrapper.addAllTracksToQueue();

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Spiral');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Giant Steps');
  });

  it('plays the item the user jumps to, then the items that did not play yet in their sequence', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();

    await QueueWrapper.selectItem('B');

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('goes back to the item that played before the jump on previous', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();

    await QueueWrapper.selectItem('B');

    await PlayerBarWrapper.previousButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
    await PlayerBarWrapper.previousButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('A');
  });

  it('continues the play order after the user jumps to an item that played before', async () => {
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();

    await QueueWrapper.selectItem('A');

    expect(PlayerBarWrapper.nowPlayingTitle).toBe('A');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('plays a new shuffled cycle after the last item with repeat all, with the item that played last at the end', async () => {
    await PlayerBarWrapper.repeatButton.click();
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();

    shuffleWillReturn('B', 'A', 'E', 'C');

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('A');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('E');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
  });

  it('shuffles added tracks into all items of a new cycle that did not play yet, including the play next tracks of the cycle before', async () => {
    await PlayerBarWrapper.repeatButton.click();
    shuffleWillReturn('C', 'E', 'B', 'D');
    await PlayerBarWrapper.shuffleButton.click();
    mockUuid.willReturn('Countdown', 'Spiral');
    await AlbumWrapper.playTrackNextViaContextMenu('Countdown');
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    await PlayerBarWrapper.nextButton.click();
    shuffleWillReturn('E', 'A', 'C', 'Countdown', 'B');
    await PlayerBarWrapper.nextButton.click();

    shuffleWillReturn('Spiral', 'D', 'A', 'Countdown', 'B', 'C');
    await AlbumWrapper.addTrackToQueueByTitle('Spiral');

    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Spiral');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('D');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('A');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('Countdown');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('B');
    await PlayerBarWrapper.nextButton.click();
    expect(PlayerBarWrapper.nowPlayingTitle).toBe('C');
  });
});
