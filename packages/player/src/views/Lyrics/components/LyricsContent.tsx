import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import map from 'lodash-es/map';
import { FC } from 'react';

import { LyricsSkeleton, PlainLyrics } from '@nuclearplayer/ui';

import { useCurrentQueueItem } from '../../../hooks/useCurrentQueueItem';
import { useProviders } from '../../../hooks/useProviders';
import { useLyrics } from '../hooks/useLyrics';
import { InstrumentalEmptyState } from './InstrumentalEmptyState';
import { NoLyricsEmptyState } from './NoLyricsEmptyState';
import { NoLyricsPluginsEmptyState } from './NoLyricsPluginsEmptyState';
import { NothingPlayingEmptyState } from './NothingPlayingEmptyState';

export const LyricsContent: FC = () => {
  const currentItem = useCurrentQueueItem();
  const providers = useProviders('lyrics');
  const { data: results = [], isLoading } = useLyrics(currentItem, providers);
  const [topResult] = results;

  if (isNil(currentItem)) {
    return <NothingPlayingEmptyState />;
  }
  if (isEmpty(providers)) {
    return <NoLyricsPluginsEmptyState />;
  }
  if (isLoading) {
    return <LyricsSkeleton data-testid="lyrics-loading" />;
  }
  if (isNil(topResult)) {
    return <NoLyricsEmptyState providerNames={map(providers, 'name')} />;
  }
  if (topResult.lyrics.type === 'instrumental') {
    return <InstrumentalEmptyState />;
  }
  if (topResult.lyrics.type === 'plain') {
    return (
      <PlainLyrics
        data-testid="lyrics-content"
        sections={topResult.lyrics.sections}
      />
    );
  }
  return null;
};
