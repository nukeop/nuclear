import type {
  Lyrics,
  LyricsCandidate,
  LyricsProvider,
} from '@nuclearplayer/plugin-sdk';

export class LyricsProviderBuilder {
  private provider: LyricsProvider;

  constructor() {
    this.provider = {
      id: 'test-lyrics-provider',
      kind: 'lyrics',
      name: 'Test Lyrics Provider',
      lyricsTypes: [],
      getCandidatesForTrack: async () => [],
      getCandidatesForQuery: async () => [],
      getLyricsForCandidate: async () => {
        throw new Error('No lyrics configured in LyricsProviderBuilder');
      },
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

  withCandidates(...candidates: LyricsCandidate[]): this {
    this.provider.getCandidatesForTrack = async () => candidates;
    return this;
  }

  withGetCandidatesForTrack(
    getCandidatesForTrack: LyricsProvider['getCandidatesForTrack'],
  ): this {
    this.provider.getCandidatesForTrack = getCandidatesForTrack;
    return this;
  }

  withLyrics(lyrics: Lyrics): this {
    this.provider.getLyricsForCandidate = async () => lyrics;
    return this;
  }

  withGetLyricsForCandidate(
    getLyricsForCandidate: LyricsProvider['getLyricsForCandidate'],
  ): this {
    this.provider.getLyricsForCandidate = getLyricsForCandidate;
    return this;
  }

  build(): LyricsProvider {
    return this.provider;
  }
}
