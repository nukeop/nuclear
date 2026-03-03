import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerBarWrapper } from '../../integration-tests/PlayerBar.test-wrapper';
import { QueueWrapper } from '../../integration-tests/Queue.test-wrapper';
import { usePlaylistStore } from '../../stores/playlistStore';
import { useQueueStore } from '../../stores/queueStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { PlaylistProviderBuilder } from '../../test/builders/PlaylistProviderBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PlaylistsWrapper } from './Playlists.test-wrapper';

const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: (...args: unknown[]) => toastSuccess(...args),
  },
}));

vi.mock('@tauri-apps/plugin-fs', async () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
}));

const IMPORT_URL = 'https://music.example.com/playlist/summer-hits-2025';

const importedPlaylist = new PlaylistBuilder()
  .withName('Summer Hits 2025')
  .withTrackNames(['Midnight Drive', 'Coastal Breeze'])
  .build();

const exampleProvider = () =>
  new PlaylistProviderBuilder()
    .withId('example-playlists')
    .withName('Example Music')
    .thatMatchesUrl('music.example.com/playlist/')
    .thatReturnsPlaylist(importedPlaylist)
    .build();

const importPlaylistFromUrl = async () => {
  await PlaylistsWrapper.import.fromUrl.click();
  await PlaylistsWrapper.import.fromUrl.dialog.importFromUrl(IMPORT_URL);
  await vi.waitFor(() => {
    expect(PlaylistsWrapper.importView).toBeInTheDocument();
  });
};

describe('import from URL', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: true,
    });
    useQueueStore.setState({ items: [], currentIndex: 0 });
    PlaylistsWrapper.clearProviders();
    toastError.mockClear();
    toastSuccess.mockClear();
  });

  it('opens the URL import dialog', async () => {
    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.import.fromUrl.click();

    expect(PlaylistsWrapper.import.fromUrl.dialog.isOpen()).toBe(true);
  });

  it('disables the import button when the URL input is empty', async () => {
    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.import.fromUrl.click();

    expect(PlaylistsWrapper.import.fromUrl.dialog.submitButton).toBeDisabled();
  });

  it('imports a playlist from a URL and shows it in the detail view', async () => {
    PlaylistsWrapper.registerPlaylistProvider(exampleProvider());

    await PlaylistsWrapper.mount();
    await importPlaylistFromUrl();

    await vi.waitFor(() => {
      expect(PlaylistsWrapper.import.fromUrl.dialog.isOpen()).toBe(false);
    });

    expect(screen.getByTestId('playlist-detail-title')).toHaveTextContent(
      'Summer Hits 2025',
    );
    expect(screen.getByTestId('read-only-badge')).toHaveTextContent(
      'Example Music',
    );
    expect(screen.getByText('Midnight Drive')).toBeInTheDocument();
    expect(screen.getByText('Coastal Breeze')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Playlist imported');
    });
  });

  it('plays all tracks when clicking the play button', async () => {
    PlaylistsWrapper.registerPlaylistProvider(exampleProvider());

    await PlaylistsWrapper.mount();
    await importPlaylistFromUrl();

    await userEvent.click(screen.getByTestId('play-all-button'));

    const queueItems = QueueWrapper.getItems();
    expect(queueItems).toHaveLength(2);
    expect(queueItems[0]?.title).toBe('Midnight Drive');
    expect(queueItems[1]?.title).toBe('Coastal Breeze');
    expect(PlayerBarWrapper.isPlaying).toBe(true);
  });

  it('saves the playlist locally as an editable copy', async () => {
    PlaylistsWrapper.registerPlaylistProvider(exampleProvider());

    await PlaylistsWrapper.mount();
    await importPlaylistFromUrl();

    await userEvent.click(screen.getByTestId('playlist-actions-button'));
    await userEvent.click(screen.getByTestId('save-locally-action'));

    await vi.waitFor(() => {
      expect(usePlaylistStore.getState().index).toHaveLength(1);
    });

    expect(screen.getByTestId('playlist-detail-title')).toHaveTextContent(
      'Summer Hits 2025',
    );
    expect(screen.queryByTestId('read-only-badge')).not.toBeInTheDocument();
    expect(screen.getByText('Midnight Drive')).toBeInTheDocument();
    expect(screen.getByText('Coastal Breeze')).toBeInTheDocument();
  });

  it('shows an error when no providers are registered', async () => {
    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.import.fromUrl.click();
    await PlaylistsWrapper.import.fromUrl.dialog.importFromUrl(IMPORT_URL);

    await vi.waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        'No plugin can handle this URL. Install a plugin that supports this service.',
      );
    });
    expect(PlaylistsWrapper.importView).not.toBeInTheDocument();
  });

  it('shows an error when no provider matches the URL', async () => {
    PlaylistsWrapper.registerPlaylistProvider(
      new PlaylistProviderBuilder()
        .thatMatchesUrl('other-service.com/playlist/')
        .build(),
    );

    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.import.fromUrl.click();
    await PlaylistsWrapper.import.fromUrl.dialog.importFromUrl(IMPORT_URL);

    await vi.waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        'No plugin can handle this URL. Install a plugin that supports this service.',
      );
    });
    expect(PlaylistsWrapper.importView).not.toBeInTheDocument();
  });

  it('shows an error when the provider fails to fetch', async () => {
    PlaylistsWrapper.registerPlaylistProvider(
      new PlaylistProviderBuilder()
        .thatMatchesUrl('music.example.com/playlist/')
        .withFetchPlaylistByUrl(async () => {
          throw new Error('API rate limited');
        })
        .build(),
    );

    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.import.fromUrl.click();
    await PlaylistsWrapper.import.fromUrl.dialog.importFromUrl(IMPORT_URL);

    await vi.waitFor(() => {
      expect(PlaylistsWrapper.importView).toBeInTheDocument();
    });

    await vi.waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        'Failed to import playlist',
        expect.objectContaining({ description: 'API rate limited' }),
      );
    });
  });
});
