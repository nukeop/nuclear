import type { Playlist } from '@nuclearplayer/model';
import type { PlaylistProvider } from '@nuclearplayer/plugin-sdk';

export class PlaylistProviderBuilder {
  private provider: PlaylistProvider;

  constructor() {
    this.provider = {
      id: 'test-playlist-provider',
      kind: 'playlists',
      name: 'Test Playlist Provider',
      matchesUrl: () => false,
      fetchPlaylistByUrl: async () => ({
        id: 'fetched-playlist',
        name: 'Fetched Playlist',
        createdAtIso: new Date().toISOString(),
        lastModifiedIso: new Date().toISOString(),
        isReadOnly: false,
        items: [],
      }),
    };
  }

  withId(id: string): this {
    this.provider.id = id;
    return this;
  }

  withName(name: string): this {
    this.provider.name = name;
    return this;
  }

  withMatchesUrl(matchesUrl: PlaylistProvider['matchesUrl']): this {
    this.provider.matchesUrl = matchesUrl;
    return this;
  }

  withFetchPlaylistByUrl(
    fetchPlaylistByUrl: PlaylistProvider['fetchPlaylistByUrl'],
  ): this {
    this.provider.fetchPlaylistByUrl = fetchPlaylistByUrl;
    return this;
  }

  thatMatchesUrl(urlPattern: string): this {
    this.provider.matchesUrl = (url: string) => url.includes(urlPattern);
    return this;
  }

  thatReturnsPlaylist(playlist: Playlist): this {
    this.provider.fetchPlaylistByUrl = async () => playlist;
    return this;
  }

  build(): PlaylistProvider {
    return this.provider;
  }
}
