import type {
  Playlist,
  PlaylistIndexEntry,
  PlaylistIndexNode,
} from '@nuclearplayer/model';

import { PlaylistIndexTree } from '../../stores/PlaylistIndexTree';
import { buildThumbnails } from './buildThumbnails';
import { PlaylistFileStore } from './PlaylistFileStore';
import { PlaylistIndexStore } from './PlaylistIndexStore';

const toIndexEntry = (playlist: Playlist): PlaylistIndexEntry => ({
  kind: 'playlist',
  id: playlist.id,
  name: playlist.name,
  createdAtIso: playlist.createdAtIso,
  lastModifiedIso: playlist.lastModifiedIso,
  isReadOnly: playlist.isReadOnly,
  artwork: playlist.artwork,
  itemCount: playlist.items.length,
  totalDurationMs: playlist.items.reduce(
    (sum, item) => sum + (item.track.durationMs ?? 0),
    0,
  ),
  thumbnails: buildThumbnails(playlist),
});

export class PlaylistFileService {
  #indexStore = new PlaylistIndexStore();
  #fileStore = new PlaylistFileStore();

  async loadIndex(): Promise<PlaylistIndexNode[]> {
    return this.#indexStore.load();
  }

  async loadPlaylist(id: string): Promise<Playlist | null> {
    return this.#fileStore.load(id);
  }

  async savePlaylist(
    playlist: Playlist,
    folderId?: string,
  ): Promise<PlaylistIndexNode[]> {
    const tree = new PlaylistIndexTree(await this.#indexStore.load());
    const { nodes } = tree.savePlaylist(toIndexEntry(playlist), folderId);
    await this.#fileStore.save(playlist);
    await this.#indexStore.save(nodes);
    return nodes;
  }

  async saveIndex(index: PlaylistIndexNode[]): Promise<void> {
    await this.#indexStore.save(index);
  }

  async deletePlaylist(id: string): Promise<PlaylistIndexNode[]> {
    await this.#fileStore.delete(id);
    const tree = new PlaylistIndexTree(await this.#indexStore.load());
    const { nodes } = tree.removePlaylist(id);
    await this.#indexStore.save(nodes);
    return nodes;
  }
}

export const playlistFileService = new PlaylistFileService();
