import { FC } from 'react';

import { LyricsContent } from './components/LyricsContent';

export const Lyrics: FC = () => (
  <div data-testid="lyrics-view" className="flex h-full flex-col px-10">
    <LyricsContent />
  </div>
);
