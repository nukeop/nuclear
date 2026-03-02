import * as dialog from '@tauri-apps/plugin-dialog';
import * as fs from '@tauri-apps/plugin-fs';
import { type Mock } from 'vitest';

import type { Playlist } from '@nuclearplayer/model';

import { usePlaylistStore } from '../../stores/playlistStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PlaylistsWrapper } from './Playlists.test-wrapper';

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
  save: vi.fn(),
}));

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

const mockPlaylistFile = (playlist: Playlist) =>
  JSON.stringify({ version: 1, playlist }, null, 2);

describe('Playlists view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: true,
    });
  });

  it('shows empty state when no playlists', async () => {
    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.emptyState).toBeInTheDocument();
  });

  it('renders playlist cards when playlists exist', async () => {
    PlaylistsWrapper.seedPlaylists(
      new PlaylistBuilder().withName('Rock Classics').withTrackCount(10),
      new PlaylistBuilder().withName('Chill Vibes').withTrackCount(8),
    );

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.emptyState).not.toBeInTheDocument();
    expect(PlaylistsWrapper.cards).toMatchSnapshot();
  });

  it('opens create dialog when clicking create button', async () => {
    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.createButton.click();

    expect(PlaylistsWrapper.createDialog.isOpen()).toBe(true);
  });

  it('creates a playlist and adds it to the list', async () => {
    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.createButton.click();
    await PlaylistsWrapper.createDialog.createPlaylist('My New Playlist');

    expect(PlaylistsWrapper.createDialog.isOpen()).toBe(false);
    expect(usePlaylistStore.getState().index).toHaveLength(1);
    expect(usePlaylistStore.getState().index[0]?.name).toBe('My New Playlist');
  });

  it('shows mosaic artwork on playlist card when 4+ tracks have art', async () => {
    PlaylistsWrapper.seedPlaylists(
      new PlaylistBuilder()
        .withName('With Art')
        .withTrackArtworks([
          'https://example.com/a.jpg',
          'https://example.com/b.jpg',
          'https://example.com/c.jpg',
          'https://example.com/d.jpg',
        ])
        .withThumbnails([
          'https://example.com/a.jpg',
          'https://example.com/b.jpg',
          'https://example.com/c.jpg',
          'https://example.com/d.jpg',
        ]),
    );

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.card(0).images).toHaveLength(4);
  });

  it('shows single artwork on playlist card when fewer than 4 tracks have art', async () => {
    PlaylistsWrapper.seedPlaylists(
      new PlaylistBuilder()
        .withName('Single Art')
        .withTrackArtworks(['https://example.com/a.jpg'])
        .withThumbnails(['https://example.com/a.jpg']),
    );

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.card(0).images).toHaveLength(1);
  });

  it('shows no artwork on playlist card when tracks have no art', async () => {
    PlaylistsWrapper.seedPlaylists(
      new PlaylistBuilder()
        .withName('No Art')
        .withTrackNames(['Track A', 'Track B']),
    );

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.card(0).images).toHaveLength(0);
  });

  it('navigates to playlist detail when clicking a card', async () => {
    PlaylistsWrapper.seedPlaylists(
      new PlaylistBuilder()
        .withId('nav-test')
        .withName('Navigate Me')
        .withTrackCount(3),
    );

    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.card(0).click();

    expect(PlaylistsWrapper.detailView).toBeInTheDocument();
  });

  describe('import from JSON', () => {
    it('imports a playlist from a JSON file and shows it in the list', async () => {
      const exportedPlaylist = new PlaylistBuilder()
        .withName('Imported Playlist')
        .withTrackNames(['Blue in Green', 'Naima'])
        .build();

      (dialog.open as Mock).mockResolvedValueOnce('/path/to/playlist.json');
      (fs.readTextFile as Mock).mockResolvedValueOnce(
        mockPlaylistFile(exportedPlaylist),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.import.fromJson.click();

      await vi.waitFor(() => {
        expect(PlaylistsWrapper.cards).toHaveLength(1);
      });
      expect(PlaylistsWrapper.card(0).name).toBe('Imported Playlist');

      await vi.waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith('Playlist imported');
      });
    });

    it('does nothing when the user cancels the file picker', async () => {
      (dialog.open as Mock).mockResolvedValueOnce(null);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.import.fromJson.click();

      expect(PlaylistsWrapper.cards).toHaveLength(0);
      expect(PlaylistsWrapper.emptyState).toBeInTheDocument();
    });

    it('shows an error toast when the file contains invalid JSON', async () => {
      (dialog.open as Mock).mockResolvedValueOnce('/path/to/bad.json');
      (fs.readTextFile as Mock).mockResolvedValueOnce('not valid json {{{');

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.import.fromJson.click();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          'Failed to import playlist',
          expect.objectContaining({ description: expect.any(String) }),
        );
      });
      expect(PlaylistsWrapper.cards).toHaveLength(0);
      expect(PlaylistsWrapper.emptyState).toBeInTheDocument();
    });

    it('shows an error toast when the file is valid JSON but not a valid playlist', async () => {
      (dialog.open as Mock).mockResolvedValueOnce('/path/to/not-playlist.json');
      (fs.readTextFile as Mock).mockResolvedValueOnce(
        JSON.stringify({ title: 'not a playlist' }),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.import.fromJson.click();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          'Failed to import playlist',
          expect.objectContaining({ description: expect.any(String) }),
        );
      });
      expect(PlaylistsWrapper.cards).toHaveLength(0);
      expect(PlaylistsWrapper.emptyState).toBeInTheDocument();
    });

    it('shows an error toast when reading the file fails', async () => {
      (dialog.open as Mock).mockResolvedValueOnce('/path/to/playlist.json');
      (fs.readTextFile as Mock).mockRejectedValueOnce(
        new Error('Permission denied'),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.import.fromJson.click();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith('Failed to import playlist', {
          description: 'Permission denied',
        });
      });
      expect(PlaylistsWrapper.cards).toHaveLength(0);
      expect(PlaylistsWrapper.emptyState).toBeInTheDocument();
    });

    it('shows an error toast when the file dialog fails', async () => {
      (dialog.open as Mock).mockRejectedValueOnce(
        new Error('Dialog unavailable'),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.import.fromJson.click();

      await vi.waitFor(() => {
        expect(toastError).toHaveBeenCalledWith('Failed to import playlist', {
          description: 'Dialog unavailable',
        });
      });
      expect(PlaylistsWrapper.cards).toHaveLength(0);
      expect(PlaylistsWrapper.emptyState).toBeInTheDocument();
    });
  });
});
