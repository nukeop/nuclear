import type { TFunction } from '@nuclearplayer/i18n';
import type { AttributedLyrics } from '@nuclearplayer/plugin-sdk';
import type { LyricsSource } from '@nuclearplayer/ui';

export const toLyricsSources = ({
  providerId,
  providerName,
  lyrics,
}: AttributedLyrics): LyricsSource[] => {
  if (lyrics.type === 'instrumental') {
    return [];
  }
  return [{ id: providerId, name: providerName, type: lyrics.type }];
};

export const formatLyricsOffset = (t: TFunction<'lyrics'>, offsetMs: number) =>
  t('offsetValue', { offset: offsetMs / 1000 });
