import { v4 as uuidv4 } from 'uuid';

import type {
  Playlist,
  PlaylistFolder,
  PlaylistIndexNode,
} from '@nuclearplayer/model';

import type { PlaylistBuilder } from './PlaylistBuilder';

export class PlaylistFolderBuilder {
  private id = uuidv4();
  private name = 'Test Folder';
  private playlists: PlaylistBuilder[] = [];

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withPlaylists(...playlists: PlaylistBuilder[]): this {
    this.playlists = playlists;
    return this;
  }

  build(): PlaylistFolder {
    return {
      kind: 'folder',
      id: this.id,
      name: this.name,
      playlists: this.playlists.map((playlist) => playlist.buildIndexEntry()),
    };
  }

  buildIndexNode(): PlaylistIndexNode {
    return this.build();
  }

  buildPlaylists(): Playlist[] {
    return this.playlists.map((playlist) => playlist.build());
  }
}

export type PlaylistIndexBuilder = PlaylistBuilder | PlaylistFolderBuilder;
