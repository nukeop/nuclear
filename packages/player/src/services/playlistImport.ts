import { v4 as uuidv4 } from 'uuid';

import type { LegacyTrack, Playlist, PlaylistItem } from '@nuclearplayer/model';
import {
  legacyConfigSchema,
  legacyPlaylistSchema,
  playlistExportSchema,
} from '@nuclearplayer/model';

export type PlaylistFormat =
  | 'nuclear'
  | 'nuclear-legacy'
  | 'nuclear-legacy-config'
  | 'unknown';

export const detectPlaylistFormat = (json: unknown): PlaylistFormat => {
  if (playlistExportSchema.safeParse(json).success) {
    return 'nuclear';
  }

  if (legacyConfigSchema.safeParse(json).success) {
    return 'nuclear-legacy-config';
  }

  if (legacyPlaylistSchema.safeParse(json).success) {
    return 'nuclear-legacy';
  }

  return 'unknown';
};

const convertLegacyTrack = (track: LegacyTrack): PlaylistItem => {
  const itemId = uuidv4();
  const nowIso = new Date().toISOString();

  return {
    id: itemId,
    addedAtIso: nowIso,
    track: {
      title: track.name ?? 'Unknown Track',
      artists: track.artist ? [{ name: track.artist, roles: ['main'] }] : [],
      album: track.album
        ? {
            title: track.album,
            source: { provider: 'nuclear-legacy', id: '' },
          }
        : undefined,
      durationMs:
        track.duration !== undefined ? track.duration * 1000 : undefined,
      artwork: track.thumbnail
        ? { items: [{ url: track.thumbnail, purpose: 'thumbnail' }] }
        : undefined,
      source: {
        provider: 'nuclear-legacy',
        id: track.uuid ?? uuidv4(),
      },
    },
  };
};

const convertLegacyPlaylist = (json: unknown): Playlist => {
  const legacy = legacyPlaylistSchema.parse(json);
  const nowIso = new Date().toISOString();

  return {
    id: uuidv4(),
    name: legacy.name,
    createdAtIso: nowIso,
    lastModifiedIso: nowIso,
    isReadOnly: false,
    items: legacy.tracks.map(convertLegacyTrack),
  };
};

export const importPlaylistFromJson = (json: unknown): Playlist[] => {
  const format = detectPlaylistFormat(json);

  switch (format) {
    case 'nuclear': {
      const { playlist } = playlistExportSchema.parse(json);
      return [playlist];
    }
    case 'nuclear-legacy':
      return [convertLegacyPlaylist(json)];
    case 'nuclear-legacy-config': {
      const { playlists } = legacyConfigSchema.parse(json);
      return playlists
        .filter((entry) => legacyPlaylistSchema.safeParse(entry).success)
        .map((entry) => convertLegacyPlaylist(entry));
    }
    case 'unknown':
      throw new Error('Unrecognized playlist format');
  }
};
