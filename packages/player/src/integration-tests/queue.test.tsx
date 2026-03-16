import { screen } from '@testing-library/react';

import { providersHost } from '../services/providersHost';
import { usePlaylistStore } from '../stores/playlistStore';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { MetadataProviderBuilder } from '../test/builders/MetadataProviderBuilder';
import {
  createMockCandidate,
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import { createQueueItem } from '../test/fixtures/queue';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { AlbumWrapper } from '../views/Album/Album.test-wrapper';
import { QueueWrapper } from './Queue.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

vi.mock(
  '../services/playlistFileService',
  async () =>
    (await import('../test/fixtures/playlists')).playlistFileServiceMock,
);

const resetQueueStore = () => {
  useQueueStore.setState({
    items: [],
    currentIndex: 0,
    isReady: true,
    isLoading: false,
  });
};

describe('Queue', () => {
  beforeEach(() => {
    resetQueueStore();

    useSettingsStore.getState().setValue('playback.streamExpiryMs', 3600000);
    useSettingsStore.getState().setValue('playback.streamResolutionRetries', 3);

    providersHost.clear();

    providersHost.register(
      MetadataProviderBuilder.albumDetailsProvider().build(),
    );

    const streamingProvider = new StreamingProviderBuilder()
      .withSearchForTrack(async (artist, title) => [
        createMockCandidate(`yt-${title}`, `${artist} - ${title}`),
      ])
      .withGetStreamUrl(async (candidateId) => createMockStream(candidateId))
      .build();
    providersHost.register(streamingProvider);
  });

  it('should display an empty queue', async () => {
    await AlbumWrapper.mountDirectly();
    const items = QueueWrapper.getItems();
    expect(items).toHaveLength(0);
    expect(await screen.findByText('Queue is empty')).toBeInTheDocument();
    expect(
      await screen.findByText('Add tracks to start playing'),
    ).toBeInTheDocument();
  });

  it('should add album tracks to the queue', async () => {
    await AlbumWrapper.mountDirectly();
    await AlbumWrapper.addTrackToQueueByTitle('Countdown');
    await QueueWrapper.waitForItems(1);
    expect(QueueWrapper.getItems()).toMatchInlineSnapshot(`
      [
        {
          "artist": "John Coltrane",
          "duration": undefined,
          "error": undefined,
          "title": "Countdown",
        },
      ]
    `);
  });

  it('should select track on double click', async () => {
    await AlbumWrapper.mountDirectly();
    await AlbumWrapper.addTrackToQueueByTitle('Countdown');
    await AlbumWrapper.addTrackToQueueByTitle('Giant Steps');

    await QueueWrapper.selectItem('Giant Steps');

    expect(QueueWrapper.getCurrentItemIndex()).toBe(1);
  });

  it('should remove track when clicking X button', async () => {
    await AlbumWrapper.mountDirectly();
    await AlbumWrapper.addTrackToQueueByTitle('Countdown');
    await QueueWrapper.waitForItems(1);
    expect(QueueWrapper.getItems()).toHaveLength(1);
    await QueueWrapper.removeItemByTitle('Countdown');
    await QueueWrapper.waitForItems(0);
    expect(QueueWrapper.getItems()).toHaveLength(0);
  });
});

describe('Queue panel actions', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    resetQueueStore();
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: true,
    });
  });

  it('does not show clear button when queue is empty', async () => {
    await QueueWrapper.mount();

    expect(QueueWrapper.clearButton.query).not.toBeInTheDocument();
  });

  it('does not show more button when queue is empty', async () => {
    await QueueWrapper.mount();

    expect(QueueWrapper.moreButton.query).not.toBeInTheDocument();
  });

  it('shows clear button when queue has items', async () => {
    QueueWrapper.seedQueue([
      createQueueItem('First Song'),
      createQueueItem('Second Song'),
    ]);

    await QueueWrapper.mount();

    expect(QueueWrapper.clearButton.element).toBeInTheDocument();
  });

  it('shows more button when queue has items', async () => {
    QueueWrapper.seedQueue([createQueueItem('First Song')]);

    await QueueWrapper.mount();

    expect(QueueWrapper.moreButton.element).toBeInTheDocument();
  });

  it('clears queue when clear button is clicked', async () => {
    QueueWrapper.seedQueue([
      createQueueItem('First Song'),
      createQueueItem('Second Song'),
      createQueueItem('Third Song'),
    ]);

    await QueueWrapper.mount();
    await QueueWrapper.clearButton.click();

    expect(QueueWrapper.items).toHaveLength(0);
    expect(QueueWrapper.emptyState).toBeInTheDocument();
  });

  it('opens more menu and shows save as playlist option', async () => {
    QueueWrapper.seedQueue([createQueueItem('First Song')]);

    await QueueWrapper.mount();
    await QueueWrapper.moreButton.click();

    expect(QueueWrapper.moreMenu.saveAsPlaylistOption).toBeInTheDocument();
  });

  it('opens save dialog when save as playlist is clicked', async () => {
    QueueWrapper.seedQueue([createQueueItem('First Song')]);

    await QueueWrapper.mount();
    await QueueWrapper.moreButton.click();
    await QueueWrapper.moreMenu.clickSaveAsPlaylist();

    expect(QueueWrapper.saveDialog.isOpen()).toBe(true);
  });

  it('saves queue as playlist with given name', async () => {
    QueueWrapper.seedQueue([
      createQueueItem('First Song'),
      createQueueItem('Second Song'),
      createQueueItem('Third Song'),
    ]);

    await QueueWrapper.mount();
    await QueueWrapper.moreButton.click();
    await QueueWrapper.moreMenu.clickSaveAsPlaylist();
    await QueueWrapper.saveDialog.saveAsPlaylist('My Queue Playlist');

    expect(QueueWrapper.saveDialog.isOpen()).toBe(false);
    expect(usePlaylistStore.getState().index).toHaveLength(1);
    expect(usePlaylistStore.getState().index[0]?.name).toBe(
      'My Queue Playlist',
    );

    const playlistEntries = Array.from(
      usePlaylistStore.getState().playlists.values(),
    );
    expect(playlistEntries).toHaveLength(1);
    expect(playlistEntries[0]?.items).toHaveLength(3);
  });
});
