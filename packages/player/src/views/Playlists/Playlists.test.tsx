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
    PlaylistsWrapper.createPlaylists(
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
    PlaylistsWrapper.createPlaylists(
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
    PlaylistsWrapper.createPlaylists(
      new PlaylistBuilder()
        .withName('Single Art')
        .withTrackArtworks(['https://example.com/a.jpg'])
        .withThumbnails(['https://example.com/a.jpg']),
    );

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.card(0).images).toHaveLength(1);
  });

  it('shows no artwork on playlist card when tracks have no art', async () => {
    PlaylistsWrapper.createPlaylists(
      new PlaylistBuilder()
        .withName('No Art')
        .withTrackNames(['Track A', 'Track B']),
    );

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.card(0).images).toHaveLength(0);
  });

  it('navigates to playlist detail when clicking a card', async () => {
    PlaylistsWrapper.createPlaylists(
      new PlaylistBuilder()
        .withId('nav-test')
        .withName('Navigate Me')
        .withTrackCount(3),
    );

    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.card(0).click();

    expect(PlaylistsWrapper.detailView).toBeInTheDocument();
  });

  it('hides the filter input when there are no playlists', async () => {
    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.filter.input).not.toBeInTheDocument();
  });

  describe('filtering', () => {
    beforeEach(() => {
      PlaylistsWrapper.createPlaylists(
        new PlaylistBuilder().withName('Rock Classics').withTrackCount(10),
        new PlaylistBuilder().withName('Chill Vibes').withTrackCount(8),
        new PlaylistBuilder().withName('Jazz Standards').withTrackCount(5),
      );
    });

    it('filters playlist cards by name as the user types', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.filter.type('rock');

      expect(PlaylistsWrapper.cards).toHaveLength(1);
      expect(PlaylistsWrapper.card(0).name).toBe('Rock Classics');
    });

    it('ignores case when filtering', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.filter.type('CHILL');

      expect(PlaylistsWrapper.cards).toHaveLength(1);
      expect(PlaylistsWrapper.card(0).name).toBe('Chill Vibes');
    });

    it('shows no results when the filter matches nothing', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.filter.type('xyzzy');

      expect(PlaylistsWrapper.cards).toHaveLength(0);
      expect(PlaylistsWrapper.filterEmptyState).toHaveTextContent(
        'No playlists match your filter',
      );
      expect(PlaylistsWrapper.filterEmptyState).toHaveTextContent(
        'Change or remove the search query',
      );
      expect(PlaylistsWrapper.emptyState).not.toBeInTheDocument();
    });

    it('restores all cards when the filter is cleared', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.filter.type('rock');
      await PlaylistsWrapper.filter.clear();

      expect(PlaylistsWrapper.cards).toHaveLength(3);
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      PlaylistsWrapper.createPlaylists(
        new PlaylistBuilder()
          .withName('Delta Jazz')
          .withCreatedAt('2024-01-04T00:00:00.000Z')
          .withLastModified('2024-03-01T00:00:00.000Z')
          .withTrackDurations([300000, 300000]),
        new PlaylistBuilder()
          .withName('Alpha Rock')
          .withCreatedAt('2024-01-02T00:00:00.000Z')
          .withLastModified('2024-03-04T00:00:00.000Z')
          .withTrackDurations(Array(8).fill(25000)),
        new PlaylistBuilder()
          .withName('Charlie Jazz')
          .withCreatedAt('2024-01-01T00:00:00.000Z')
          .withLastModified('2024-03-02T00:00:00.000Z')
          .withTrackDurations(Array(5).fill(180000)),
        new PlaylistBuilder()
          .withName('Bravo Rock')
          .withCreatedAt('2024-01-03T00:00:00.000Z')
          .withLastModified('2024-03-03T00:00:00.000Z')
          .withTrackDurations([400000]),
      );
    });

    it('shows the oldest playlists first by default', async () => {
      await PlaylistsWrapper.mount();

      expect(PlaylistsWrapper.sort.select.selected()).toBe('Date added');
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Charlie Jazz',
        'Alpha Rock',
        'Bravo Rock',
        'Delta Jazz',
      ]);
    });

    it('sorts by name', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Name');

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Alpha Rock',
        'Bravo Rock',
        'Charlie Jazz',
        'Delta Jazz',
      ]);
    });

    it('reverses the order when the direction is flipped', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Name');
      await PlaylistsWrapper.sort.direction.toggle();

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Delta Jazz',
        'Charlie Jazz',
        'Bravo Rock',
        'Alpha Rock',
      ]);
    });

    it('sorts by date modified', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Date modified');

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Delta Jazz',
        'Charlie Jazz',
        'Bravo Rock',
        'Alpha Rock',
      ]);
    });

    it('sorts by number of tracks', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Tracks');

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Bravo Rock',
        'Delta Jazz',
        'Charlie Jazz',
        'Alpha Rock',
      ]);
    });

    it('sorts by total length', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Length');

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Alpha Rock',
        'Bravo Rock',
        'Delta Jazz',
        'Charlie Jazz',
      ]);
    });

    it('sorts the playlists left over after filtering', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Name');
      await PlaylistsWrapper.sort.direction.toggle();
      await PlaylistsWrapper.filter.type('rock');

      expect(PlaylistsWrapper.cardNames).toEqual(['Bravo Rock', 'Alpha Rock']);
    });

    it('keeps the chosen sort after leaving the page and coming back', async () => {
      const { history } = await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Name');
      await PlaylistsWrapper.card(0).click();

      expect(PlaylistsWrapper.detailView).toBeInTheDocument();

      history.back();
      await PlaylistsWrapper.waitForView();

      expect(PlaylistsWrapper.sort.select.selected()).toBe('Name');
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Alpha Rock',
        'Bravo Rock',
        'Charlie Jazz',
        'Delta Jazz',
      ]);
    });
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
