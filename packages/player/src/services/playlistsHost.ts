import type { Playlist, Track } from '@nuclearplayer/model';
import type {
  PlaylistsHost,
  PlaylistsListener,
} from '@nuclearplayer/plugin-sdk';

import { PlaylistIndexTree } from '../stores/PlaylistIndexTree';
import { usePlaylistStore } from '../stores/playlistStore';

export const createPlaylistsHost = (): PlaylistsHost => ({
  getIndex: async () =>
    new PlaylistIndexTree(usePlaylistStore.getState().index).playlists(),

  getPlaylist: async (id: string) =>
    usePlaylistStore.getState().loadPlaylist(id),

  createPlaylist: async (name: string) =>
    usePlaylistStore.getState().createPlaylist(name),

  deletePlaylist: async (id: string) =>
    usePlaylistStore.getState().deletePlaylist(id),

  addTracks: async (playlistId: string, tracks: Track[]) =>
    usePlaylistStore.getState().addTracks(playlistId, tracks),

  removeTracks: async (playlistId: string, itemIds: string[]) =>
    usePlaylistStore.getState().removeTracks(playlistId, itemIds),

  reorderTracks: async (playlistId: string, from: number, to: number) =>
    usePlaylistStore.getState().reorderTracks(playlistId, from, to),

  importPlaylist: async (playlist: Playlist) =>
    usePlaylistStore.getState().importPlaylist(playlist),

  saveQueueAsPlaylist: async (name: string, folderId?: string | null) =>
    usePlaylistStore
      .getState()
      .saveQueueAsPlaylist(name, folderId ?? undefined),

  getIndexTree: async () => usePlaylistStore.getState().index,

  createFolder: async (name: string) =>
    usePlaylistStore.getState().createFolder(name),

  renameFolder: async (id: string, name: string) =>
    usePlaylistStore.getState().renameFolder(id, name),

  deleteFolder: async (id: string) =>
    usePlaylistStore.getState().deleteFolder(id),

  movePlaylistToFolder: async (playlistId: string, folderId?: string | null) =>
    usePlaylistStore
      .getState()
      .movePlaylistToFolder(playlistId, folderId ?? undefined),

  subscribe: (listener: PlaylistsListener) =>
    usePlaylistStore.subscribe((state, previous) => {
      if (state.index === previous.index) {
        return;
      }
      listener(new PlaylistIndexTree(state.index).playlists());
    }),
});

export const playlistsHost = createPlaylistsHost();
