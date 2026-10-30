import * as dialog from '@tauri-apps/plugin-dialog';
import * as fs from '@tauri-apps/plugin-fs';
import { type Mock } from 'vitest';

import {
  PLAYLIST_EXPORT_VERSION,
  stripResolutionState,
  type Playlist,
  type Track,
} from '@nuclearplayer/model';

import { PlayerBarWrapper } from '../../integration-tests/PlayerBar.test-wrapper';
import { providersHost } from '../../services/providersHost';
import { usePlaylistStore } from '../../stores/playlistStore';
import { useQueueStore } from '../../stores/queueStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { PlaylistFolderBuilder } from '../../test/builders/PlaylistFolderBuilder';
import {
  createMockCandidate,
  StreamingProviderBuilder,
} from '../../test/builders/StreamingProviderBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PlaylistDetailWrapper } from '../PlaylistDetail/PlaylistDetail.test-wrapper';
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
  remove: vi.fn(),
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
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

    it('shows playlists in their saved order by default', async () => {
      await PlaylistsWrapper.mount();

      expect(PlaylistsWrapper.sort.select.selected()).toBe('Custom');
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Delta Jazz',
        'Alpha Rock',
        'Charlie Jazz',
        'Bravo Rock',
      ]);
    });

    it('lets the user drag every card in custom order', async () => {
      await PlaylistsWrapper.mount();

      expect(PlaylistsWrapper.draggableCardNames).toEqual([
        'Delta Jazz',
        'Alpha Rock',
        'Charlie Jazz',
        'Bravo Rock',
      ]);
    });

    it('moves a playlist to where the user drags it', async () => {
      await PlaylistsWrapper.mount();

      await PlaylistsWrapper.dragCard('Bravo Rock', 'Alpha Rock');

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Delta Jazz',
        'Bravo Rock',
        'Alpha Rock',
        'Charlie Jazz',
      ]);
    });

    it.each(['Name', 'Date added', 'Date modified', 'Tracks', 'Length'])(
      'does not let the user drag cards while sorted by %s',
      async (sortOption) => {
        await PlaylistsWrapper.mount();

        await PlaylistsWrapper.sort.select.select(sortOption);

        expect(PlaylistsWrapper.draggableCardNames).toEqual([]);
      },
    );

    it('does not let the user drag cards while filtering', async () => {
      await PlaylistsWrapper.mount();

      await PlaylistsWrapper.filter.type('Rock');

      expect(PlaylistsWrapper.draggableCardNames).toEqual([]);
    });

    it('shows the saved order after switching to custom from a reversed sort', async () => {
      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Name');
      await PlaylistsWrapper.sort.direction.toggle();

      await PlaylistsWrapper.sort.select.select('Custom');

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Delta Jazz',
        'Alpha Rock',
        'Charlie Jazz',
        'Bravo Rock',
      ]);
    });

    it('does not let the user reverse the custom order', async () => {
      await PlaylistsWrapper.mount();

      expect(PlaylistsWrapper.sort.direction.element).toBeDisabled();
    });

    it('sorts by date added', async () => {
      await PlaylistsWrapper.mount();

      await PlaylistsWrapper.sort.select.select('Date added');

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
  });

  describe('without opening a playlist', () => {
    const existingTrack: Track = {
      title: 'Existing Track',
      artists: [],
      source: { provider: 'test', id: 'existing' },
    };

    const roadTrip = new PlaylistBuilder()
      .withName('Road Trip')
      .withTrackCount(2);
    const roadTripTracks = roadTrip.build().items.map((item) => item.track);

    const queuedTracks = () =>
      useQueueStore.getState().items.map((item) => item.track);

    beforeEach(() => {
      PlaylistsWrapper.clearProviders();
      useQueueStore.setState({ items: [], currentIndex: 0 });
      useQueueStore.getState().addToQueue([existingTrack]);
    });

    it('plays a playlist in place of the queue', async () => {
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack(async (artist: string, title: string) => [
            createMockCandidate(`candidate-${title}`, `${artist} - ${title}`),
          ])
          .build(),
      );
      await PlaylistsWrapper.savePlaylists(roadTrip);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.card(0).play();

      await vi.waitFor(() => {
        expect(PlayerBarWrapper.isPlaying).toBe(true);
      });
      expect(queuedTracks().map(stripResolutionState)).toEqual(roadTripTracks);
      expect(PlaylistsWrapper.detailView).not.toBeInTheDocument();
    });

    it('has no play button for an empty playlist', async () => {
      PlaylistsWrapper.createPlaylists(
        new PlaylistBuilder().withName('Road Trip').withTrackCount(2),
        new PlaylistBuilder().withName('Empty'),
      );

      await PlaylistsWrapper.mount();

      expect(PlaylistsWrapper.card(0).playButton).toBeInTheDocument();
      expect(PlaylistsWrapper.card(1).playButton).not.toBeInTheDocument();
    });

    it('adds a playlist to the queue', async () => {
      await PlaylistsWrapper.savePlaylists(roadTrip);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.card(0).menu.addToQueue();

      await vi.waitFor(() => {
        expect(queuedTracks()).toEqual([existingTrack, ...roadTripTracks]);
      });
      expect(PlaylistsWrapper.detailView).not.toBeInTheDocument();
    });

    it('exports a playlist as JSON', async () => {
      (dialog.save as Mock).mockResolvedValue('/downloads/Road Trip.json');
      await PlaylistsWrapper.savePlaylists(roadTrip);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.card(0).menu.exportJson();

      await vi.waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith('Playlist exported');
      });
      const [path, json] = (fs.writeTextFile as Mock).mock.calls[0];
      expect(path).toBe('/downloads/Road Trip.json');
      expect(JSON.parse(json)).toEqual({
        version: PLAYLIST_EXPORT_VERSION,
        playlist: roadTrip.build(),
      });
      expect(PlaylistsWrapper.detailView).not.toBeInTheDocument();
    });

    it('deletes a playlist after you confirm', async () => {
      await PlaylistsWrapper.savePlaylists(
        roadTrip,
        new PlaylistBuilder().withName('Late Night'),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.card(0).menu.delete();
      await PlaylistsWrapper.deleteDialog.confirm();

      expect(PlaylistsWrapper.cardNames).toEqual(['Late Night']);
    });

    it('keeps a playlist when you cancel deleting it', async () => {
      await PlaylistsWrapper.savePlaylists(
        roadTrip,
        new PlaylistBuilder().withName('Late Night'),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.card(0).menu.delete();
      await PlaylistsWrapper.deleteDialog.cancel();

      expect(PlaylistsWrapper.cardNames).toEqual(['Road Trip', 'Late Night']);
    });
  });

  describe('folders', () => {
    const roadTrip = new PlaylistBuilder().withName('Road Trip');
    const lateNight = new PlaylistBuilder().withName('Late Night');
    const beach = new PlaylistBuilder().withName('Beach').withTrackCount(2);
    const pool = new PlaylistBuilder().withName('Pool');
    const summer = new PlaylistFolderBuilder()
      .withName('Summer')
      .withPlaylists(beach, pool);

    it('creates a folder after the existing playlists', async () => {
      PlaylistsWrapper.createPlaylists(roadTrip);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.createFolder('Summer');

      expect(PlaylistsWrapper.cardNames).toEqual(['Road Trip', 'Summer']);
      expect(PlaylistsWrapper.folderNames).toEqual(['Summer']);
      expect(PlaylistsWrapper.folder('Summer').subtitle).toBe('0 playlists');
    });

    it('opens a folder to show the playlists inside it', async () => {
      PlaylistsWrapper.createPlaylists(roadTrip, summer);

      await PlaylistsWrapper.mount();
      expect(PlaylistsWrapper.cardNames).toEqual(['Road Trip', 'Summer']);
      expect(PlaylistsWrapper.folder('Summer').subtitle).toBe('2 playlists');

      await PlaylistsWrapper.folder('Summer').open();
      expect(PlaylistsWrapper.title).toBe('Summer');
      expect(PlaylistsWrapper.cardNames).toEqual(['Beach', 'Pool']);

      await PlaylistsWrapper.goBack();
      expect(PlaylistsWrapper.title).toBe('Playlists');
      expect(PlaylistsWrapper.cardNames).toEqual(['Road Trip', 'Summer']);
    });

    it('moves a playlist into a folder', async () => {
      PlaylistsWrapper.createPlaylists(roadTrip, lateNight, summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.card(0).menu.moveToFolder('Summer');

      expect(PlaylistsWrapper.cardNames).toEqual(['Late Night', 'Summer']);
      await PlaylistsWrapper.folder('Summer').open();
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Beach',
        'Pool',
        'Road Trip',
      ]);
    });

    it('takes a playlist out of a folder', async () => {
      PlaylistsWrapper.createPlaylists(
        roadTrip,
        new PlaylistFolderBuilder().withName('Summer').withPlaylists(beach),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').open();
      await PlaylistsWrapper.card(0).menu.removeFromFolder();

      expect(PlaylistsWrapper.cards).toHaveLength(0);
      expect(PlaylistsWrapper.emptyState).toHaveTextContent(
        'This folder is empty',
      );
      await PlaylistsWrapper.goBack();
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Road Trip',
        'Summer',
        'Beach',
      ]);
    });

    it('creates a playlist inside the open folder', async () => {
      await PlaylistsWrapper.savePlaylists(roadTrip, summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').open();
      await PlaylistsWrapper.createButton.click();
      await PlaylistsWrapper.createDialog.createPlaylist('Picnic');

      expect(PlaylistsWrapper.cardNames).toEqual(['Beach', 'Pool', 'Picnic']);
      await PlaylistsWrapper.goBack();
      expect(PlaylistsWrapper.cardNames).toEqual(['Road Trip', 'Summer']);
    });

    it('does not let you create a folder inside a folder', async () => {
      PlaylistsWrapper.createPlaylists(summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').open();

      expect(PlaylistsWrapper.newFolderButton.element).not.toBeInTheDocument();
    });

    it('renames a folder', async () => {
      PlaylistsWrapper.createPlaylists(summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').menu.rename('Winter');

      expect(PlaylistsWrapper.folderNames).toEqual(['Winter']);
    });

    it('suggests the current name when you rename a folder again', async () => {
      PlaylistsWrapper.createPlaylists(summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').menu.rename('Winter');
      await PlaylistsWrapper.folder('Winter').menu.openRenameDialog();

      expect(PlaylistsWrapper.folderNameInput.value).toBe('Winter');
    });

    it('goes back to the folder after you delete a playlist from its page', async () => {
      await PlaylistsWrapper.savePlaylists(summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').open();
      await PlaylistsWrapper.card(0).click();
      await PlaylistDetailWrapper.deleteDialog.openFromActions();
      await PlaylistDetailWrapper.deleteDialog.confirmButton.click();

      await vi.waitFor(() => {
        expect(PlaylistsWrapper.title).toBe('Summer');
      });
      expect(PlaylistsWrapper.cardNames).toEqual(['Pool']);
    });

    it('deletes a folder but keeps its playlists in its place', async () => {
      PlaylistsWrapper.createPlaylists(roadTrip, summer, lateNight);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').menu.delete();
      await PlaylistsWrapper.deleteDialog.confirm();

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Road Trip',
        'Beach',
        'Pool',
        'Late Night',
      ]);
    });

    it('keeps a deleted folder deleted after a restart', async () => {
      await PlaylistsWrapper.savePlaylists(roadTrip, summer, lateNight);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').menu.delete();
      await PlaylistsWrapper.deleteDialog.confirm();
      await PlaylistsWrapper.restart();

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Road Trip',
        'Beach',
        'Pool',
        'Late Night',
      ]);
    });

    it('moves a folder to where you drag it', async () => {
      PlaylistsWrapper.createPlaylists(roadTrip, lateNight, summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.dragCard('Summer', 'Road Trip');

      expect(PlaylistsWrapper.cardNames).toEqual([
        'Summer',
        'Road Trip',
        'Late Night',
      ]);
    });

    it('moves a playlist into a folder when you drag it onto the folder', async () => {
      PlaylistsWrapper.createPlaylists(roadTrip, lateNight, summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.dragCard('Road Trip', 'Summer');

      expect(PlaylistsWrapper.cardNames).toEqual(['Late Night', 'Summer']);
      await PlaylistsWrapper.folder('Summer').open();
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Beach',
        'Pool',
        'Road Trip',
      ]);
    });

    it('puts a playlist in the place of a folder when you drop it on the edge of the folder', async () => {
      PlaylistsWrapper.createPlaylists(summer, roadTrip);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.dragCardToEdge('Road Trip', 'Summer');

      expect(PlaylistsWrapper.cardNames).toEqual(['Road Trip', 'Summer']);
      expect(PlaylistsWrapper.folder('Summer').subtitle).toBe('2 playlists');
    });

    it('reorders a folder when you drag it onto another folder', async () => {
      PlaylistsWrapper.createPlaylists(
        summer,
        new PlaylistFolderBuilder().withName('Autumn'),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.dragCard('Autumn', 'Summer');

      expect(PlaylistsWrapper.cardNames).toEqual(['Autumn', 'Summer']);
    });

    it('reorders the playlists inside a folder', async () => {
      PlaylistsWrapper.createPlaylists(summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').open();
      await PlaylistsWrapper.dragCard('Pool', 'Beach');

      expect(PlaylistsWrapper.cardNames).toEqual(['Pool', 'Beach']);
    });

    it('finds the playlists inside folders when filtering', async () => {
      PlaylistsWrapper.createPlaylists(roadTrip, summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.filter.type('beach');

      expect(PlaylistsWrapper.cardNames).toEqual(['Beach']);
    });

    it('lists folders before playlists, both sorted by name', async () => {
      PlaylistsWrapper.createPlaylists(
        roadTrip,
        summer,
        lateNight,
        new PlaylistFolderBuilder().withName('Autumn'),
      );

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.sort.select.select('Name');
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Autumn',
        'Summer',
        'Late Night',
        'Road Trip',
      ]);

      await PlaylistsWrapper.sort.direction.toggle();
      expect(PlaylistsWrapper.cardNames).toEqual([
        'Summer',
        'Autumn',
        'Road Trip',
        'Late Night',
      ]);
    });

    it('adds a playlist inside a folder to the queue', async () => {
      useQueueStore.setState({ items: [], currentIndex: 0 });
      await PlaylistsWrapper.savePlaylists(summer);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.folder('Summer').open();
      await PlaylistsWrapper.card(0).menu.addToQueue();

      await vi.waitFor(() => {
        expect(
          useQueueStore.getState().items.map((item) => item.track),
        ).toEqual(beach.build().items.map((item) => item.track));
      });
    });

    it('keeps folders after a restart', async () => {
      await PlaylistsWrapper.savePlaylists(roadTrip, lateNight);

      await PlaylistsWrapper.mount();
      await PlaylistsWrapper.createFolder('Summer');
      await PlaylistsWrapper.card(0).menu.moveToFolder('Summer');
      await PlaylistsWrapper.restart();

      expect(PlaylistsWrapper.cardNames).toEqual(['Late Night', 'Summer']);
      await PlaylistsWrapper.folder('Summer').open();
      expect(PlaylistsWrapper.cardNames).toEqual(['Road Trip']);
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
