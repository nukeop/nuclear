import type { Playlist, Track } from '@nuclearplayer/model';
import type {
  PlaylistsHost,
  PlaylistsListener,
} from '@nuclearplayer/plugin-sdk';

import { usePlaylistStore } from '../stores/playlistStore';

export const createPlaylistsHost = (): PlaylistsHost => ({
  getIndex: async () => usePlaylistStore.getState().index,

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

  saveQueueAsPlaylist: async (name: string) =>
    usePlaylistStore.getState().saveQueueAsPlaylist(name),

  subscribe: (listener: PlaylistsListener) =>
    usePlaylistStore.subscribe((state) => listener(state.index)),
});

export const playlistsHost = createPlaylistsHost();
