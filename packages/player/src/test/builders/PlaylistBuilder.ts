import cloneDeep from 'lodash-es/cloneDeep';
import { v4 as uuidv4 } from 'uuid';

import type {
  Playlist,
  PlaylistIndexEntry,
  PlaylistItem,
  ProviderRef,
  Track,
} from '@nuclearplayer/model';

const now = () => new Date().toISOString();

const defaultTrack = (): Track => ({
  title: `Track ${uuidv4()}`,
  artists: [
    {
      name: 'Test Artist',
      roles: [],
      source: { provider: 'test', id: uuidv4() },
    },
  ],
  durationMs: 180000,
  source: { provider: 'test', id: uuidv4() },
});

const defaultItem = (): PlaylistItem => ({
  id: uuidv4(),
  track: defaultTrack(),
  addedAtIso: now(),
});

export class PlaylistBuilder {
  private playlist: Playlist;

  constructor() {
    this.playlist = {
      id: uuidv4(),
      name: 'Test Playlist',
      createdAtIso: now(),
      lastModifiedIso: now(),
      isReadOnly: false,
      items: [],
    };
  }

  withId(id: string): this {
    this.playlist.id = id;
    return this;
  }

  withName(name: string): this {
    this.playlist.name = name;
    return this;
  }

  withItems(items: PlaylistItem[]): this {
    this.playlist.items = items;
    return this;
  }

  withTrackCount(count: number): this {
    this.playlist.items = Array.from({ length: count }, defaultItem);
    return this;
  }

  withTrackNames(names: string[]): this {
    this.playlist.items = names.map((title) => ({
      id: uuidv4(),
      track: { ...defaultTrack(), title },
      addedAtIso: now(),
    }));
    return this;
  }

  readOnly(): this {
    this.playlist.isReadOnly = true;
    return this;
  }

  withOrigin(origin: ProviderRef): this {
    this.playlist.origin = origin;
    return this;
  }

  withArtwork(url: string): this {
    this.playlist.artwork = {
      items: [{ url }],
    };
    return this;
  }

  build(): Playlist {
    return cloneDeep(this.playlist);
  }

  buildIndexEntry(): PlaylistIndexEntry {
    const playlist = this.build();
    return {
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
    };
  }
}
