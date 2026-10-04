import find from 'lodash-es/find';
import head from 'lodash-es/head';
import isNil from 'lodash-es/isNil';
import { FC, useRef, useState } from 'react';

import type { QueueItem } from '@nuclearplayer/model';
import { cn, ScrollableArea } from '@nuclearplayer/ui';

import { useCoreSetting } from '../../../hooks/useCoreSetting';
import { useProviders } from '../../../hooks/useProviders';
import { useLyrics } from '../hooks/useLyrics';
import { useLyricsOffset } from '../hooks/useLyricsOffset';
import { LyricsContent } from './LyricsContent';
import { LyricsToolbar } from './LyricsToolbar';

type LyricsForTrackProps = {
  currentItem: QueueItem | undefined;
};

export const LyricsForTrack: FC<LyricsForTrackProps> = ({ currentItem }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const providers = useProviders('lyrics');
  const { data: results = [], isLoading } = useLyrics(currentItem, providers);
  const [selectedProviderId, setSelectedProviderId] = useState<string>();
  const selectedResult =
    find(results, { providerId: selectedProviderId }) ?? head(results);
  const [textSize] = useCoreSetting<number>('lyrics.textSize');
  const { offsetMs, showEarlier, showLater } = useLyricsOffset();

  return (
    <>
      <LyricsToolbar
        results={results}
        selectedResult={selectedResult}
        onSelectProvider={setSelectedProviderId}
        offsetMs={offsetMs}
        onShowEarlier={showEarlier}
        onShowLater={showLater}
      />
      <ScrollableArea
        data-testid="lyrics-scroll-area"
        viewportRef={viewportRef}
        className="min-h-0 flex-1"
        viewportClassName="scroll-smooth mask-y-from-95% px-10 py-10"
      >
        <LyricsContent
          currentItem={currentItem}
          providers={providers}
          isLoading={isLoading}
          result={selectedResult}
          offsetMs={offsetMs}
          viewportRef={viewportRef}
          textSizeClass={cn(
            !isNil(textSize) && ['text-3xl', 'text-4xl', 'text-5xl'][textSize],
          )}
        />
      </ScrollableArea>
    </>
  );
};
