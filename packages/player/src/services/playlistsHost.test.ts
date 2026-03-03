import { usePlaylistStore } from '../stores/playlistStore';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../test/utils/mockTrack';
import { mockUuid } from '../test/utils/mockUuid';
import { playlistsHost } from './playlistsHost';

describe('playlistsHost', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mockUuid.reset();
    resetInMemoryTauriStore();
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: false,
    });
  });

  it('gets the playlist index', async () => {
    await usePlaylistStore.getState().createPlaylist('Test Playlist');

    const index = await playlistsHost.getIndex();

    expect(index).toMatchInlineSnapshot(`
      [
        {
          "artwork": undefined,
          "createdAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-0",
          "isReadOnly": false,
          "itemCount": 0,
          "lastModifiedIso": "2026-01-01T00:00:00.000Z",
          "name": "Test Playlist",
          "thumbnails": [],
          "totalDurationMs": 0,
        },
      ]
    `);
  });

  it('gets a playlist by id', async () => {
    const playlistId = await usePlaylistStore
      .getState()
      .createPlaylist('Fetched Playlist');
    await usePlaylistStore
      .getState()
      .addTracks(playlistId, [createMockTrack('Song A')]);

    const playlist = await playlistsHost.getPlaylist(playlistId);

    expect(playlist).toMatchInlineSnapshot(`
      {
        "createdAtIso": "2026-01-01T00:00:00.000Z",
        "id": "mock-uuid-0",
        "isReadOnly": false,
        "items": [
          {
            "addedAtIso": "2026-01-01T00:00:00.000Z",
            "id": "mock-uuid-1",
            "track": {
              "artists": [
                {
                  "name": "Test Artist",
                  "roles": [
                    "primary",
                  ],
                },
              ],
              "source": {
                "id": "song a",
                "provider": "test",
              },
              "title": "Song A",
            },
          },
        ],
        "lastModifiedIso": "2026-01-01T00:00:00.000Z",
        "name": "Fetched Playlist",
      }
    `);
  });

  it('creates a playlist with correct structure', async () => {
    const playlistId = await playlistsHost.createPlaylist('My Playlist');

    const playlist = usePlaylistStore.getState().playlists.get(playlistId);
    expect(playlist).toMatchInlineSnapshot(`
      {
        "createdAtIso": "2026-01-01T00:00:00.000Z",
        "id": "mock-uuid-0",
        "isReadOnly": false,
        "items": [],
        "lastModifiedIso": "2026-01-01T00:00:00.000Z",
        "name": "My Playlist",
      }
    `);
    expect(playlistId).toBe('mock-uuid-0');

    const index = usePlaylistStore.getState().index;
    expect(index).toHaveLength(1);
    expect(index[0].id).toBe(playlistId);
  });

  it('deletes a playlist', async () => {
    const playlistId = await usePlaylistStore
      .getState()
      .createPlaylist('To Delete');

    await playlistsHost.deletePlaylist(playlistId);

    expect(usePlaylistStore.getState().index).toHaveLength(0);
    expect(usePlaylistStore.getState().playlists.has(playlistId)).toBe(false);
  });

  it('adds tracks to a playlist and returns the created items', async () => {
    const playlistId = await usePlaylistStore
      .getState()
      .createPlaylist('Track Playlist');

    const addedItems = await playlistsHost.addTracks(playlistId, [
      createMockTrack('Song A'),
      createMockTrack('Song B'),
    ]);

    expect(addedItems).toMatchInlineSnapshot(`
      [
        {
          "addedAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-1",
          "track": {
            "artists": [
              {
                "name": "Test Artist",
                "roles": [
                  "primary",
                ],
              },
            ],
            "source": {
              "id": "song a",
              "provider": "test",
            },
            "title": "Song A",
          },
        },
        {
          "addedAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-2",
          "track": {
            "artists": [
              {
                "name": "Test Artist",
                "roles": [
                  "primary",
                ],
              },
            ],
            "source": {
              "id": "song b",
              "provider": "test",
            },
            "title": "Song B",
          },
        },
      ]
    `);

    const playlist = usePlaylistStore.getState().playlists.get(playlistId);
    expect(playlist?.items).toHaveLength(2);
    expect(playlist?.items[0].track.title).toBe('Song A');
    expect(playlist?.items[1].track.title).toBe('Song B');
  });

  it('removes specific tracks by item id', async () => {
    const playlistId = await usePlaylistStore
      .getState()
      .createPlaylist('Remove Tracks Playlist');
    const addedItems = await usePlaylistStore
      .getState()
      .addTracks(playlistId, [
        createMockTrack('Song A'),
        createMockTrack('Song B'),
        createMockTrack('Song C'),
      ]);

    await playlistsHost.removeTracks(playlistId, [
      addedItems[0].id,
      addedItems[2].id,
    ]);

    const playlist = usePlaylistStore.getState().playlists.get(playlistId);
    expect(playlist?.items).toHaveLength(1);
    expect(playlist?.items[0].id).toBe(addedItems[1].id);
    expect(playlist?.items[0].track.title).toBe('Song B');
  });

  it('reorders tracks by moving from one position to another', async () => {
    const playlistId = await usePlaylistStore
      .getState()
      .createPlaylist('Reorder Playlist');
    await usePlaylistStore
      .getState()
      .addTracks(playlistId, [
        createMockTrack('A'),
        createMockTrack('B'),
        createMockTrack('C'),
      ]);

    await playlistsHost.reorderTracks(playlistId, 0, 2);

    const playlist = usePlaylistStore.getState().playlists.get(playlistId);
    const titles = playlist?.items.map((item) => item.track.title);
    expect(titles).toEqual(['B', 'C', 'A']);
  });

  it('subscribes to index changes with full index entries', async () => {
    const listener = vi.fn();
    playlistsHost.subscribe(listener);

    await usePlaylistStore.getState().createPlaylist('Subscribed Playlist');

    expect(listener).toHaveBeenCalled();
    const lastCallArg = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCallArg).toMatchInlineSnapshot(`
      [
        {
          "artwork": undefined,
          "createdAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-0",
          "isReadOnly": false,
          "itemCount": 0,
          "lastModifiedIso": "2026-01-01T00:00:00.000Z",
          "name": "Subscribed Playlist",
          "thumbnails": [],
          "totalDurationMs": 0,
        },
      ]
    `);
  });

  it('unsubscribes from index changes', async () => {
    const listener = vi.fn();
    const unsubscribe = playlistsHost.subscribe(listener);

    unsubscribe();
    await usePlaylistStore.getState().createPlaylist('After Unsubscribe');

    expect(listener).not.toHaveBeenCalled();
  });
});
