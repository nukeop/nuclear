import { playlistFileService } from '../services/playlistFileService';
import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../test/utils/mockTrack';
import { mockUuid } from '../test/utils/mockUuid';
import { usePlaylistStore } from './playlistStore';
import { useQueueStore } from './queueStore';

const resetStore = () => {
  usePlaylistStore.setState({
    index: [],
    playlists: new Map(),
    loaded: false,
  });
};

describe('playlistStore', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mockUuid.reset();
    resetInMemoryTauriStore();
    resetStore();
  });

  it('creates a new empty playlist', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('My Playlist');

    expect(id).toBeDefined();
    expect(usePlaylistStore.getState().index).toMatchInlineSnapshot(`
      [
        {
          "artwork": undefined,
          "createdAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-0",
          "isReadOnly": false,
          "itemCount": 0,
          "lastModifiedIso": "2026-01-01T00:00:00.000Z",
          "name": "My Playlist",
          "thumbnails": [],
          "totalDurationMs": 0,
        },
      ]
    `);
    expect(usePlaylistStore.getState().playlists.get(id))
      .toMatchInlineSnapshot(`
      {
        "createdAtIso": "2026-01-01T00:00:00.000Z",
        "id": "mock-uuid-0",
        "isReadOnly": false,
        "items": [],
        "lastModifiedIso": "2026-01-01T00:00:00.000Z",
        "name": "My Playlist",
      }
    `);
  });

  it('deletes a playlist from index and cache', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('To Delete');
    await usePlaylistStore.getState().deletePlaylist(id);

    expect(usePlaylistStore.getState().index).toHaveLength(0);
    expect(usePlaylistStore.getState().playlists.has(id)).toBe(false);
  });

  it('adds tracks to a playlist', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('My Playlist');
    const track = createMockTrack('New Song');

    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
    await usePlaylistStore.getState().addTracks(id, [track]);

    const updated = usePlaylistStore.getState().playlists.get(id);
    expect(updated?.items).toHaveLength(1);
    expect(updated?.items[0].track.title).toBe('New Song');
    expect(updated?.items[0].addedAtIso).toBe('2026-06-15T12:00:00.000Z');
    expect(updated?.lastModifiedIso).toBe('2026-06-15T12:00:00.000Z');
  });

  it('loads playlist from disk before adding tracks if not cached', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('Uncached');

    usePlaylistStore.setState((state) => ({
      playlists: (() => {
        const map = new Map(state.playlists);
        map.delete(id);
        return map;
      })(),
    }));
    expect(usePlaylistStore.getState().playlists.has(id)).toBe(false);

    const track = createMockTrack('Added While Uncached');
    await usePlaylistStore.getState().addTracks(id, [track]);

    const updated = usePlaylistStore.getState().playlists.get(id);
    expect(updated?.items).toHaveLength(1);
    expect(updated?.items[0].track.title).toBe('Added While Uncached');
  });

  it('throws when adding tracks to a nonexistent playlist', async () => {
    const track = createMockTrack('Orphan');

    await expect(
      usePlaylistStore.getState().addTracks('nonexistent', [track]),
    ).rejects.toThrow('Playlist nonexistent not found');
  });

  it('removes tracks by item IDs', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('My Playlist');
    const trackA = createMockTrack('Song A');
    const trackB = createMockTrack('Song B');
    const items = await usePlaylistStore
      .getState()
      .addTracks(id, [trackA, trackB]);

    await usePlaylistStore.getState().removeTracks(id, [items[0].id]);

    const updated = usePlaylistStore.getState().playlists.get(id);
    expect(updated?.items).toHaveLength(1);
    expect(updated?.items[0].track.title).toBe('Song B');
  });

  it('reorders tracks from one position to another', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('My Playlist');
    const items = await usePlaylistStore
      .getState()
      .addTracks(id, [
        createMockTrack('A'),
        createMockTrack('B'),
        createMockTrack('C'),
      ]);

    await usePlaylistStore.getState().reorderTracks(id, 0, 2);

    const updated = usePlaylistStore.getState().playlists.get(id);
    expect(updated?.items.map((i) => i.id)).toEqual([
      items[1].id,
      items[2].id,
      items[0].id,
    ]);
  });

  it('saves current queue as a new playlist', async () => {
    useQueueStore
      .getState()
      .addToQueue([
        createMockTrack('Queue Track 1'),
        createMockTrack('Queue Track 2'),
      ]);

    const id = await usePlaylistStore
      .getState()
      .saveQueueAsPlaylist('From Queue');

    const playlist = usePlaylistStore.getState().playlists.get(id);
    expect(playlist).toMatchSnapshot();
  });

  it('loads index from file service', async () => {
    const playlist = new PlaylistBuilder().withTrackCount(2).build();
    await playlistFileService.savePlaylist(playlist);

    usePlaylistStore.setState({ index: [], loaded: false });
    await usePlaylistStore.getState().loadIndex();

    expect(usePlaylistStore.getState().index).toHaveLength(1);
    expect(usePlaylistStore.getState().loaded).toBe(true);
  });

  it('loads a playlist and caches it', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('Cached');
    usePlaylistStore.setState({ playlists: new Map() });

    const loaded = await usePlaylistStore.getState().loadPlaylist(id);

    expect(loaded?.name).toBe('Cached');
    expect(usePlaylistStore.getState().playlists.has(id)).toBe(true);
  });

  it('returns cached playlist without hitting disk', async () => {
    const id = await usePlaylistStore
      .getState()
      .createPlaylist('Already Cached');

    const loaded = await usePlaylistStore.getState().loadPlaylist(id);

    expect(loaded?.name).toBe('Already Cached');
  });

  describe('updatePlaylist', () => {
    it('updates the playlist name', async () => {
      const id = await usePlaylistStore.getState().createPlaylist('Original');

      vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
      await usePlaylistStore.getState().updatePlaylist(id, { name: 'Renamed' });

      const updated = usePlaylistStore.getState().playlists.get(id);
      expect(updated?.name).toBe('Renamed');
      expect(updated?.lastModifiedIso).toBe('2026-06-15T12:00:00.000Z');
    });
  });
});
