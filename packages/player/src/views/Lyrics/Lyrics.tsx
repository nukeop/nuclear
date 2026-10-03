import { FC } from 'react';

import { PlainLyrics } from '@nuclearplayer/ui';

import { useLyrics } from './hooks/useLyrics';

export const Lyrics: FC = () => {
  const { data: results = [] } = useLyrics();
  const [topResult] = results;

  return (
    <div data-testid="lyrics-view" className="flex h-full flex-col">
      {topResult?.lyrics.type === 'plain' && (
        <PlainLyrics
          data-testid="lyrics-content"
          sections={topResult.lyrics.sections}
        />
      )}
    </div>
  );
};
