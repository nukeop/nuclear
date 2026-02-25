import type {
  Playlist,
  PlaylistIndexEntry,
  PlaylistItem,
  Track,
} from '@nuclearplayer/model';

import type { PlaylistsHost, PlaylistsListener } from '../types/playlists';

export class PlaylistsAPI {
  #host?: PlaylistsHost;

  constructor(host?: PlaylistsHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: PlaylistsHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Playlists host not available');
    }
    return fn(host);
  }

  getIndex(): Promise<PlaylistIndexEntry[]> {
    return this.#withHost((host) => host.getIndex());
  }

  getPlaylist(id: string): Promise<Playlist | null> {
    return this.#withHost((host) => host.getPlaylist(id));
  }

  createPlaylist(name: string): Promise<string> {
    return this.#withHost((host) => host.createPlaylist(name));
  }

  deletePlaylist(id: string): Promise<void> {
    return this.#withHost((host) => host.deletePlaylist(id));
  }

  addTracks(playlistId: string, tracks: Track[]): Promise<PlaylistItem[]> {
    return this.#withHost((host) => host.addTracks(playlistId, tracks));
  }

  removeTracks(playlistId: string, itemIds: string[]): Promise<void> {
    return this.#withHost((host) => host.removeTracks(playlistId, itemIds));
  }

  reorderTracks(playlistId: string, from: number, to: number): Promise<void> {
    return this.#withHost((host) => host.reorderTracks(playlistId, from, to));
  }

  importPlaylist(playlist: Playlist): Promise<string> {
    return this.#withHost((host) => host.importPlaylist(playlist));
  }

  saveQueueAsPlaylist(name: string): Promise<string> {
    return this.#withHost((host) => host.saveQueueAsPlaylist(name));
  }

  subscribe(listener: PlaylistsListener): () => void {
    return this.#withHost((host) => host.subscribe(listener));
  }
}
