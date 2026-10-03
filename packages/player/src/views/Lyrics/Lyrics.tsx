import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import { FC } from 'react';

import { LyricsSkeleton, PlainLyrics } from '@nuclearplayer/ui';

import { useCurrentQueueItem } from '../../hooks/useCurrentQueueItem';
import { useProviders } from '../../hooks/useProviders';
import { NoLyricsPluginsEmptyState } from './components/NoLyricsPluginsEmptyState';
import { NothingPlayingEmptyState } from './components/NothingPlayingEmptyState';
import { useLyrics } from './hooks/useLyrics';

export const Lyrics: FC = () => {
  const currentItem = useCurrentQueueItem();
  const providers = useProviders('lyrics');
  const { data: results = [], isLoading } = useLyrics();
  const [topResult] = results;

  return (
    <div data-testid="lyrics-view" className="flex h-full flex-col">
      {isNil(currentItem) && <NothingPlayingEmptyState />}
      {!isNil(currentItem) && isEmpty(providers) && (
        <NoLyricsPluginsEmptyState />
      )}
      {isLoading && <LyricsSkeleton data-testid="lyrics-loading" />}
      {topResult?.lyrics.type === 'plain' && (
        <PlainLyrics
          data-testid="lyrics-content"
          sections={topResult.lyrics.sections}
        />
      )}
    </div>
  );
};
