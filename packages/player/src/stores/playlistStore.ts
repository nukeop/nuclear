import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import type {
  Playlist,
  PlaylistIndexEntry,
  PlaylistItem,
  Track,
} from '@nuclearplayer/model';

import { playlistFileService } from '../services/playlistFileService';
import { useQueueStore } from './queueStore';

type PlaylistStore = {
  index: PlaylistIndexEntry[];
  playlists: Map<string, Playlist>;
  loaded: boolean;

  loadIndex: () => Promise<void>;
  loadPlaylist: (id: string) => Promise<Playlist | null>;
  createPlaylist: (name: string) => Promise<string>;
  deletePlaylist: (id: string) => Promise<void>;
  addTracks: (playlistId: string, tracks: Track[]) => Promise<PlaylistItem[]>;
  removeTracks: (playlistId: string, itemIds: string[]) => Promise<void>;
  importPlaylist: (playlist: Playlist) => Promise<string>;
  saveQueueAsPlaylist: (name: string) => Promise<string>;
  reorderTracks: (
    playlistId: string,
    from: number,
    to: number,
  ) => Promise<void>;
  updatePlaylist: (
    id: string,
    updates: Partial<
      Pick<Playlist, 'name' | 'description' | 'tags' | 'artwork'>
    >,
  ) => Promise<void>;
};

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  index: [],
  playlists: new Map(),
  loaded: false,

  loadIndex: async () => {
    const index = await playlistFileService.loadIndex();
    set({ index, loaded: true });
  },

  loadPlaylist: async (id: string) => {
    const cached = get().playlists.get(id);
    if (cached) {
      return cached;
    }

    const playlist = await playlistFileService.loadPlaylist(id);
    if (playlist) {
      set((state) => ({
        playlists: new Map(state.playlists).set(id, playlist),
      }));
    }
    return playlist;
  },

  createPlaylist: async (name: string) => {
    const now = new Date().toISOString();
    const playlist: Playlist = {
      id: uuidv4(),
      name,
      createdAtIso: now,
      lastModifiedIso: now,
      isReadOnly: false,
      items: [],
    };

    const index = await playlistFileService.savePlaylist(playlist);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlist.id, playlist),
      index,
    }));

    return playlist.id;
  },

  importPlaylist: async (playlist: Playlist) => {
    const now = new Date().toISOString();
    const imported: Playlist = {
      ...playlist,
      id: uuidv4(),
      createdAtIso: now,
      lastModifiedIso: now,
      isReadOnly: false,
    };

    const index = await playlistFileService.savePlaylist(imported);

    set((state) => ({
      playlists: new Map(state.playlists).set(imported.id, imported),
      index,
    }));

    return imported.id;
  },

  addTracks: async (playlistId: string, tracks: Track[]) => {
    const playlist = await get().loadPlaylist(playlistId);
    if (!playlist) {
      throw new Error(`Playlist ${playlistId} not found`);
    }

    const now = new Date().toISOString();
    const newItems: PlaylistItem[] = tracks.map((track) => ({
      id: uuidv4(),
      track,
      addedAtIso: now,
    }));

    const updated: Playlist = {
      ...playlist,
      items: [...playlist.items, ...newItems],
      lastModifiedIso: now,
    };

    const index = await playlistFileService.savePlaylist(updated);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlistId, updated),
      index,
    }));

    return newItems;
  },

  removeTracks: async (playlistId: string, itemIds: string[]) => {
    const playlist = await get().loadPlaylist(playlistId);
    if (!playlist) {
      return;
    }

    const idsToRemove = new Set(itemIds);
    const updated: Playlist = {
      ...playlist,
      items: playlist.items.filter((item) => !idsToRemove.has(item.id)),
      lastModifiedIso: new Date().toISOString(),
    };

    const index = await playlistFileService.savePlaylist(updated);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlistId, updated),
      index,
    }));
  },

  reorderTracks: async (playlistId: string, from: number, to: number) => {
    const playlist = get().playlists.get(playlistId);
    if (!playlist) {
      return;
    }

    const items = [...playlist.items];
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);

    const updated: Playlist = {
      ...playlist,
      items,
      lastModifiedIso: new Date().toISOString(),
    };

    set((state) => ({
      playlists: new Map(state.playlists).set(playlistId, updated),
    }));

    const index = await playlistFileService.savePlaylist(updated);
    set({ index });
  },

  saveQueueAsPlaylist: async (name: string) => {
    const tracks = useQueueStore.getState().items.map((item) => item.track);
    const now = new Date().toISOString();

    const playlist: Playlist = {
      id: uuidv4(),
      name,
      createdAtIso: now,
      lastModifiedIso: now,
      isReadOnly: false,
      items: tracks.map((track) => ({
        id: uuidv4(),
        track,
        addedAtIso: now,
      })),
    };

    const index = await playlistFileService.savePlaylist(playlist);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlist.id, playlist),
      index,
    }));

    return playlist.id;
  },

  updatePlaylist: async (id, updates) => {
    const playlist = await get().loadPlaylist(id);
    if (!playlist) {
      throw new Error(`Playlist ${id} not found`);
    }

    const updated: Playlist = {
      ...playlist,
      ...updates,
      lastModifiedIso: new Date().toISOString(),
    };

    const index = await playlistFileService.savePlaylist(updated);

    set((state) => ({
      playlists: new Map(state.playlists).set(id, updated),
      index,
    }));
  },

  deletePlaylist: async (id: string) => {
    const index = await playlistFileService.deletePlaylist(id);

    set((state) => {
      const playlists = new Map(state.playlists);
      playlists.delete(id);
      return { playlists, index };
    });
  },
}));

export const initializePlaylistStore = async (): Promise<void> => {
  await usePlaylistStore.getState().loadIndex();
};
