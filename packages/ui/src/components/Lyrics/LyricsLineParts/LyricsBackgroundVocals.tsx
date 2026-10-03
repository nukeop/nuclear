import { FC } from 'react';

import type { LyricsSegment } from '@nuclearplayer/model';

import { LyricsSegments } from './LyricsSegments';

export const LyricsBackgroundVocals: FC<{ segments: LyricsSegment[] }> = ({
  segments,
}) => (
  <span
    data-testid="lyrics-background-vocals"
    className="font-semibold italic opacity-60"
  >
    {' ('}
    <LyricsSegments segments={segments} />
    {')'}
  </span>
);
