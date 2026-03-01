import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Playlist } from '@nuclearplayer/model';

import { detectPlaylistFormat, importPlaylistFromJson } from './playlistImport';

let uuidCounter = 0;
vi.mock('uuid', () => ({
  v4: () => {
    uuidCounter++;
    return `test-uuid-${uuidCounter}`;
  },
}));

const FROZEN_NOW = '2025-06-15T12:00:00.000Z';

beforeEach(() => {
  uuidCounter = 0;
  vi.setSystemTime(new Date(FROZEN_NOW));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('detectPlaylistFormat', () => {
  it('returns nuclear for a valid Nuclear envelope', () => {
    expect(
      detectPlaylistFormat({
        version: 1,
        playlist: {
          id: 'pl-1',
          name: 'My Playlist',
          createdAtIso: FROZEN_NOW,
          lastModifiedIso: FROZEN_NOW,
          isReadOnly: false,
          items: [],
        },
      }),
    ).toBe('nuclear');
  });

  it('returns nuclear-legacy for a legacy playlist', () => {
    expect(
      detectPlaylistFormat({
        name: 'Old Playlist',
        tracks: [{ artist: 'Radiohead', name: 'Creep' }],
      }),
    ).toBe('nuclear-legacy');
  });

  it('returns nuclear-legacy-config when playlists array has valid entries', () => {
    expect(
      detectPlaylistFormat({
        playlists: [{ name: 'Playlist 1', tracks: [] }],
      }),
    ).toBe('nuclear-legacy-config');
  });

  it('returns unknown for an empty or invalid playlists array', () => {
    expect(detectPlaylistFormat({ playlists: [] })).toBe('unknown');
    expect(detectPlaylistFormat({ playlists: [1, 2, 3] })).toBe('unknown');
  });

  it('falls through to nuclear-legacy when playlists array is empty but legacy shape matches', () => {
    expect(
      detectPlaylistFormat({
        playlists: [],
        name: 'My Playlist',
        tracks: [{ name: 'Track' }],
      }),
    ).toBe('nuclear-legacy');
  });

  it('prefers Nuclear envelope when multiple shapes match', () => {
    expect(
      detectPlaylistFormat({
        version: 1,
        playlist: {
          id: 'pl-1',
          name: 'Ambiguous',
          createdAtIso: FROZEN_NOW,
          lastModifiedIso: FROZEN_NOW,
          isReadOnly: false,
          items: [],
        },
        name: 'Also a name',
        tracks: [],
      }),
    ).toBe('nuclear');
  });

  it('returns unknown for non-object values', () => {
    expect(detectPlaylistFormat(null)).toBe('unknown');
    expect(detectPlaylistFormat(42)).toBe('unknown');
    expect(detectPlaylistFormat('hello')).toBe('unknown');
    expect(detectPlaylistFormat([1, 2, 3])).toBe('unknown');
    expect(detectPlaylistFormat(undefined)).toBe('unknown');
  });
});

describe('importPlaylistFromJson', () => {
  it('passes through a Nuclear envelope playlist', () => {
    const playlist: Playlist = {
      id: 'nuclear-pl-1',
      name: 'Nuclear Playlist',
      createdAtIso: FROZEN_NOW,
      lastModifiedIso: FROZEN_NOW,
      isReadOnly: false,
      items: [],
    };

    const result = importPlaylistFromJson({ version: 1, playlist });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(playlist);
  });

  it('converts a legacy track with all fields', () => {
    const result = importPlaylistFromJson({
      name: 'My Playlist',
      tracks: [
        {
          uuid: 'original-uuid-1',
          artist: 'Radiohead',
          name: 'Creep',
          album: 'Pablo Honey',
          thumbnail: 'https://example.com/thumb.jpg',
          duration: 236,
        },
      ],
    });

    expect(result[0].items[0]).toMatchInlineSnapshot(`
      {
        "addedAtIso": "2025-06-15T12:00:00.000Z",
        "id": "test-uuid-2",
        "track": {
          "album": {
            "source": {
              "id": "",
              "provider": "nuclear-legacy",
            },
            "title": "Pablo Honey",
          },
          "artists": [
            {
              "name": "Radiohead",
              "roles": [
                "main",
              ],
            },
          ],
          "artwork": {
            "items": [
              {
                "purpose": "thumbnail",
                "url": "https://example.com/thumb.jpg",
              },
            ],
          },
          "durationMs": 236000,
          "source": {
            "id": "original-uuid-1",
            "provider": "nuclear-legacy",
          },
          "title": "Creep",
        },
      }
    `);
  });

  it('handles missing optional fields with sensible defaults', () => {
    const result = importPlaylistFromJson({
      name: 'Sparse Playlist',
      tracks: [{ artist: 'Someone' }, { name: 'Instrumental' }],
    });

    const trackWithoutName = result[0].items[0].track;
    expect(trackWithoutName.title).toBe('Unknown Track');
    expect(trackWithoutName.artwork).toBeUndefined();
    expect(trackWithoutName.album).toBeUndefined();

    const trackWithoutArtist = result[0].items[1].track;
    expect(trackWithoutArtist.artists).toEqual([]);
  });

  it('coerces string durations to milliseconds', () => {
    const result = importPlaylistFromJson({
      name: 'Playlist',
      tracks: [{ name: 'Track', duration: '180' }],
    });

    expect(result[0].items[0].track.durationMs).toBe(180_000);
  });

  it('rejects non-finite duration values', () => {
    expect(() =>
      importPlaylistFromJson({
        name: 'Bad Duration',
        tracks: [{ name: 'Track', duration: 'not-a-number' }],
      }),
    ).toThrow();
  });

  it('imports multiple playlists from a legacy config', () => {
    const result = importPlaylistFromJson({
      playlists: [
        {
          name: 'Playlist One',
          tracks: [{ artist: 'Radiohead', name: 'Creep', duration: 236 }],
        },
        {
          name: 'Playlist Two',
          tracks: [{ artist: 'Portishead', name: 'Glory Box', duration: 305 }],
        },
      ],
    });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Playlist One');
    expect(result[1].name).toBe('Playlist Two');
  });

  it('skips invalid entries in a legacy config', () => {
    const result = importPlaylistFromJson({
      playlists: [
        42,
        { name: 'Valid', tracks: [{ name: 'Track' }] },
        { notAPlaylist: true },
        { name: 'Also Valid', tracks: [] },
      ],
    });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Valid');
    expect(result[1].name).toBe('Also Valid');
  });

  it('throws on unrecognized formats', () => {
    expect(() => importPlaylistFromJson(null)).toThrow(
      'Unrecognized playlist format',
    );
    expect(() => importPlaylistFromJson({ foo: 'bar' })).toThrow(
      'Unrecognized playlist format',
    );
  });
});
