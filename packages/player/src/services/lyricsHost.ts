import isNil from 'lodash-es/isNil';
import sortBy from 'lodash-es/sortBy';

import type { Lyrics, Track } from '@nuclearplayer/model';
import type {
  AttributedLyrics,
  LyricsHost,
  LyricsProvider,
} from '@nuclearplayer/plugin-sdk';

import { reportError } from '../utils/logging';
import { providersHost } from './providersHost';

const LYRICS_TYPE_RANK: Record<Lyrics['type'], number> = {
  wordSynced: 0,
  lineSynced: 1,
  plain: 2,
  instrumental: 3,
};

const reportProviderError = (error: unknown) =>
  reportError('lyrics', {
    userMessage: 'A lyrics provider failed to load lyrics',
    error,
  });

const getLyricsFromProvider = async (
  provider: LyricsProvider,
  track: Track,
): Promise<AttributedLyrics[]> => {
  const lyrics = await provider.getLyrics(track, {});
  if (isNil(lyrics)) {
    return [];
  }
  return [
    {
      providerId: provider.id,
      providerName: provider.name,
      lyrics,
    },
  ];
};

const getLyricsFromSingleProvider = async (
  track: Track,
  providerId: string,
): Promise<AttributedLyrics[]> => {
  const provider = providersHost.get<LyricsProvider>(providerId, 'lyrics');
  if (!provider) {
    throw new Error(`Lyrics provider not found: ${providerId}`);
  }
  try {
    return await getLyricsFromProvider(provider, track);
  } catch (error) {
    await reportProviderError(error);
    throw error;
  }
};

const getRankedLyricsFromAllProviders = async (
  track: Track,
): Promise<AttributedLyrics[]> => {
  const providers = providersHost.list('lyrics') as LyricsProvider[];
  const results = await Promise.all(
    providers.map((provider) =>
      getLyricsFromProvider(provider, track).catch(async (error) => {
        await reportProviderError(error);
        return [];
      }),
    ),
  );
  return sortBy(
    results.flat(),
    (result) => LYRICS_TYPE_RANK[result.lyrics.type],
  );
};

export const createLyricsHost = (): LyricsHost => ({
  getLyricsForTrack: async (track, providerId) => {
    if (providerId) {
      return getLyricsFromSingleProvider(track, providerId);
    }
    return getRankedLyricsFromAllProviders(track);
  },
});

export const lyricsHost: LyricsHost = createLyricsHost();
