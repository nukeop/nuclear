import type { Lyrics, Track } from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type LyricsRequestOptions = object;

export type LyricsProvider = ProviderDescriptor<'lyrics'> & {
  getLyrics: (
    track: Track,
    options: LyricsRequestOptions,
  ) => Promise<Lyrics | undefined>;
};

export type AttributedLyrics = {
  providerId: string;
  providerName: string;
  lyrics: Lyrics;
};

export type LyricsHost = {
  getLyricsForTrack: (
    track: Track,
    providerId?: string,
  ) => Promise<AttributedLyrics[]>;
};
