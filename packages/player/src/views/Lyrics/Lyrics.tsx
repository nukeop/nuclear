import { FC, useRef } from 'react';

import { ScrollableArea } from '@nuclearplayer/ui';

import { useCurrentQueueItem } from '../../hooks/useCurrentQueueItem';
import { useProviders } from '../../hooks/useProviders';
import { LyricsContent } from './components/LyricsContent';
import { LyricsToolbar } from './components/LyricsToolbar';
import { useLyrics } from './hooks/useLyrics';
import { useLyricsOffset } from './hooks/useLyricsOffset';

export const Lyrics: FC = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const currentItem = useCurrentQueueItem();
  const providers = useProviders('lyrics');
  const { data: results = [], isLoading } = useLyrics(currentItem, providers);
  const [topResult] = results;
  const { offsetMs, showEarlier, showLater } = useLyricsOffset(currentItem?.id);

  return (
    <div data-testid="lyrics-view" className="flex h-full flex-col">
      <LyricsToolbar
        lyrics={topResult?.lyrics}
        offsetMs={offsetMs}
        onShowEarlier={showEarlier}
        onShowLater={showLater}
      />
      <ScrollableArea
        viewportRef={viewportRef}
        className="min-h-0 flex-1"
        viewportClassName="scroll-smooth mask-y-from-95% px-10 py-10"
      >
        <LyricsContent
          currentItem={currentItem}
          providers={providers}
          isLoading={isLoading}
          topResult={topResult}
          offsetMs={offsetMs}
          viewportRef={viewportRef}
        />
      </ScrollableArea>
    </div>
  );
};
