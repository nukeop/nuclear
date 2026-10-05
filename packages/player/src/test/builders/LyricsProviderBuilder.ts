import type { Lyrics, LyricsProvider } from '@nuclearplayer/plugin-sdk';

export class LyricsProviderBuilder {
  private provider: LyricsProvider;

  constructor() {
    this.provider = {
      id: 'test-lyrics-provider',
      kind: 'lyrics',
      name: 'Test Lyrics Provider',
      getLyrics: async () => undefined,
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

  withLyrics(lyrics: Lyrics): this {
    this.provider.getLyrics = async () => lyrics;
    return this;
  }

  withGetLyrics(getLyrics: LyricsProvider['getLyrics']): this {
    this.provider.getLyrics = getLyrics;
    return this;
  }

  build(): LyricsProvider {
    return this.provider;
  }
}
