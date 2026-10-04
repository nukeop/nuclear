import type {
  Lyrics,
  LyricsCandidate,
  LyricsQuery,
  Track,
} from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type LyricsRequestOptions = object;

export type LyricsProvider = ProviderDescriptor<'lyrics'> & {
  getCandidatesForTrack: (
    track: Track,
    options: LyricsRequestOptions,
  ) => Promise<LyricsCandidate[]>;

  getCandidatesForQuery: (
    query: LyricsQuery,
    options: LyricsRequestOptions,
  ) => Promise<LyricsCandidate[]>;

  getLyricsForCandidate: (
    candidate: LyricsCandidate,
    options: LyricsRequestOptions,
  ) => Promise<Lyrics>;
};

export type AttributedLyrics = {
  providerId: string;
  providerName: string;
  candidate: LyricsCandidate;
  lyrics: Lyrics;
};

export type LyricsHost = {
  getLyricsForTrack: (
    track: Track,
    providerId?: string,
  ) => Promise<AttributedLyrics[]>;
};
