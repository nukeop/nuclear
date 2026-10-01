import type {
  Lyrics,
  LyricsCandidate,
  LyricsQuery,
  LyricsType,
  Track,
} from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type LyricsRequestOptions = object;

export type LyricsProvider = ProviderDescriptor<'lyrics'> & {
  lyricsTypes: LyricsType[];

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
