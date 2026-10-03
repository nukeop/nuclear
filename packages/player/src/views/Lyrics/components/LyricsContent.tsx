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
  topResult: AttributedLyrics | undefined;
  offsetMs: number;
  viewportRef: RefObject<HTMLDivElement>;
};

export const LyricsContent: FC<LyricsContentProps> = ({
  currentItem,
  providers,
  isLoading,
  topResult,
  offsetMs,
  viewportRef,
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
        vocalists={topResult.lyrics.metadata.vocalists}
      />
    );
  }
  return (
    <ConnectedSyncedLyrics
      lyrics={topResult.lyrics}
      offsetMs={offsetMs}
      viewportRef={viewportRef}
    />
  );
};
