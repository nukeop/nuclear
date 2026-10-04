import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import map from 'lodash-es/map';
import { FC, RefObject } from 'react';

import type { QueueItem } from '@nuclearplayer/model';
import type {
  AttributedLyrics,
  ProviderDescriptor,
} from '@nuclearplayer/plugin-sdk';
import { LyricsSkeleton, PlainLyrics } from '@nuclearplayer/ui';

import { ConnectedSyncedLyrics } from './ConnectedSyncedLyrics';
import { InstrumentalEmptyState } from './InstrumentalEmptyState';
import { NoLyricsEmptyState } from './NoLyricsEmptyState';
import { NoLyricsPluginsEmptyState } from './NoLyricsPluginsEmptyState';
import { NothingPlayingEmptyState } from './NothingPlayingEmptyState';

type LyricsContentProps = {
  currentItem: QueueItem | undefined;
  providers: ProviderDescriptor<'lyrics'>[];
  isLoading: boolean;
  result: AttributedLyrics | undefined;
  offsetMs: number;
  viewportRef: RefObject<HTMLDivElement>;
  textSizeClass: string;
};

export const LyricsContent: FC<LyricsContentProps> = ({
  currentItem,
  providers,
  isLoading,
  result,
  offsetMs,
  viewportRef,
  textSizeClass,
}) => {
  if (isNil(currentItem)) {
    return <NothingPlayingEmptyState />;
  }
  if (isEmpty(providers)) {
    return <NoLyricsPluginsEmptyState />;
  }
  if (isLoading) {
    return <LyricsSkeleton data-testid="lyrics-loading" />;
  }
  if (isNil(result)) {
    return <NoLyricsEmptyState providerNames={map(providers, 'name')} />;
  }
  if (result.lyrics.type === 'instrumental') {
    return <InstrumentalEmptyState />;
  }
  if (result.lyrics.type === 'plain') {
    return (
      <PlainLyrics
        data-testid="lyrics-content"
        className={textSizeClass}
        sections={result.lyrics.sections}
        vocalists={result.lyrics.metadata.vocalists}
      />
    );
  }
  return (
    <ConnectedSyncedLyrics
      className={textSizeClass}
      lyrics={result.lyrics}
      offsetMs={offsetMs}
      viewportRef={viewportRef}
    />
  );
};
