import { LazyStore } from '@tauri-apps/plugin-store';

import type { PlaylistIndexNode } from '@nuclearplayer/model';
import { playlistIndexSchema } from '@nuclearplayer/model';

import { loadValidated } from '../validatedStore';

const PLAYLISTS_DIR = 'playlists';

export class PlaylistIndexStore {
  #store = new LazyStore(`${PLAYLISTS_DIR}/index.json`);

  async load(): Promise<PlaylistIndexNode[]> {
    return (
      (await loadValidated(
        this.#store,
        'entries',
        playlistIndexSchema,
        'playlists',
      )) ?? []
    );
  }

  async save(index: PlaylistIndexNode[]): Promise<void> {
    await this.#store.set('entries', index);
    await this.#store.save();
  }
}
