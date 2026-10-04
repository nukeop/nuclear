import { FC } from 'react';

import { useCurrentQueueItem } from '../../hooks/useCurrentQueueItem';
import { LyricsForTrack } from './components/LyricsForTrack';

export const Lyrics: FC = () => {
  const currentItem = useCurrentQueueItem();

  return (
    <div data-testid="lyrics-view" className="flex h-full flex-col">
      <LyricsForTrack key={currentItem?.id} currentItem={currentItem} />
    </div>
  );
};
