import { LazyStore } from '@tauri-apps/plugin-store';
import omit from 'lodash-es/omit';

import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { PlaylistFolderBuilder } from '../../test/builders/PlaylistFolderBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { mockUuid } from '../../test/utils/mockUuid';
import { PlaylistFileService } from './index';

describe('PlaylistFileService', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mockUuid.reset();
    resetInMemoryTauriStore();
  });

  it('returns empty index when no playlists saved', async () => {
    expect(await new PlaylistFileService().loadIndex()).toEqual([]);
  });

  it('round-trips a playlist through save and load', async () => {
    const service = new PlaylistFileService();
    const playlist = new PlaylistBuilder().withTrackCount(1).build();
    await service.savePlaylist(playlist);
    expect(await service.loadPlaylist(playlist.id)).toEqual(playlist);
  });

  it('updates the index when saving a playlist', async () => {
    const service = new PlaylistFileService();
    const playlist = new PlaylistBuilder().withTrackCount(2).build();
    const index = await service.savePlaylist(playlist);
    expect(index).toMatchInlineSnapshot(`
      [
        {
          "artwork": undefined,
          "createdAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-0",
          "isReadOnly": false,
          "itemCount": 2,
          "kind": "playlist",
          "lastModifiedIso": "2026-01-01T00:00:00.000Z",
          "name": "Test Playlist",
          "thumbnails": [],
          "totalDurationMs": 360000,
        },
      ]
    `);
  });

  it('removes playlist and updates index on delete', async () => {
    const service = new PlaylistFileService();
    const playlist = new PlaylistBuilder().build();
    await service.savePlaylist(playlist);
    const index = await service.deletePlaylist(playlist.id);

    expect(index).toHaveLength(0);
    expect(await service.loadPlaylist(playlist.id)).toBeNull();
  });

  it('returns null for nonexistent playlist', async () => {
    expect(
      await new PlaylistFileService().loadPlaylist('nonexistent'),
    ).toBeNull();
  });

  it('returns null for corrupted playlist data', async () => {
    const store = new LazyStore('playlists/corrupt.json');
    await store.set('playlist', { garbage: true, notAPlaylist: 42 });
    await store.save();

    const service = new PlaylistFileService();
    expect(await service.loadPlaylist('corrupt')).toBeNull();
  });

  it('returns empty index for corrupted index data', async () => {
    const store = new LazyStore('playlists/index.json');
    await store.set('entries', 'not an array');
    await store.save();

    expect(await new PlaylistFileService().loadIndex()).toEqual([]);
  });

  it('loads an index saved before folders existed', async () => {
    const playlist = new PlaylistBuilder().withName('Road Trip');
    const store = new LazyStore('playlists/index.json');
    await store.set('entries', [omit(playlist.buildIndexEntry(), 'kind')]);
    await store.save();

    expect(await new PlaylistFileService().loadIndex()).toEqual([
      playlist.buildIndexEntry(),
    ]);
  });

  it('keeps a playlist in its folder when the playlist is saved again', async () => {
    const service = new PlaylistFileService();
    const roadTrip = new PlaylistBuilder().withName('Road Trip');
    const beach = new PlaylistBuilder().withName('Beach');
    const summer = new PlaylistFolderBuilder()
      .withName('Summer')
      .withPlaylists(beach);
    await service.saveIndex([roadTrip.buildIndexEntry(), summer.build()]);

    const renamedBeach = beach.withName('Beach Party');
    const index = await service.savePlaylist(renamedBeach.build());

    expect(index).toEqual([
      roadTrip.buildIndexEntry(),
      summer.withPlaylists(renamedBeach).build(),
    ]);
  });

  it('removes a deleted playlist from its folder', async () => {
    const service = new PlaylistFileService();
    const beach = new PlaylistBuilder().withName('Beach');
    const pool = new PlaylistBuilder().withName('Pool');
    const summer = new PlaylistFolderBuilder()
      .withName('Summer')
      .withPlaylists(beach, pool);
    await service.saveIndex([summer.build()]);

    const index = await service.deletePlaylist(beach.build().id);

    expect(index).toEqual([summer.withPlaylists(pool).build()]);
  });

  it('returns empty index when entries contain invalid items', async () => {
    const store = new LazyStore('playlists/index.json');
    await store.set('entries', [{ id: 123, missing: 'required fields' }]);
    await store.save();

    expect(await new PlaylistFileService().loadIndex()).toEqual([]);
  });
});
