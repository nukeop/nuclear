import type {
  Playlist,
  PlaylistIndexEntry,
  PlaylistItem,
  Track,
} from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type PlaylistsListener = (index: PlaylistIndexEntry[]) => void;

export type PlaylistProvider = ProviderDescriptor<'playlists'> & {
  matchesUrl: (url: string) => boolean;
  fetchPlaylistByUrl: (url: string) => Promise<Playlist>;
};

export type PlaylistsHost = {
  getIndex: () => Promise<PlaylistIndexEntry[]>;
  getPlaylist: (id: string) => Promise<Playlist | null>;
  createPlaylist: (name: string) => Promise<string>;
  deletePlaylist: (id: string) => Promise<void>;
  addTracks: (playlistId: string, tracks: Track[]) => Promise<PlaylistItem[]>;
  removeTracks: (playlistId: string, itemIds: string[]) => Promise<void>;
  reorderTracks: (
    playlistId: string,
    from: number,
    to: number,
  ) => Promise<void>;
  importPlaylist: (playlist: Playlist) => Promise<string>;
  saveQueueAsPlaylist: (name: string) => Promise<string>;
  subscribe: (listener: PlaylistsListener) => () => void;
};
