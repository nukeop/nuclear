import type {
  Playlist,
  PlaylistIndexEntry,
  PlaylistIndexNode,
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
  saveQueueAsPlaylist: (
    name: string,
    folderId?: string | null,
  ) => Promise<string>;
  getIndexTree: () => Promise<PlaylistIndexNode[]>;
  createFolder: (name: string) => Promise<string>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  movePlaylistToFolder: (
    playlistId: string,
    folderId?: string | null,
  ) => Promise<void>;
  subscribe: (listener: PlaylistsListener) => () => void;
};
