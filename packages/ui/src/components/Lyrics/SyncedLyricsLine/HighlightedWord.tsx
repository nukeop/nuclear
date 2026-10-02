import { FC } from 'react';

import type { TimedLyricsSegment } from '@nuclearplayer/model';

import { LyricsSegment } from '../LyricsLineParts';
import { getTimingState } from '../utils';
import { LyricsHighlighter } from './LyricsHighlighter';

type HighlightedWordProps = {
  segment: TimedLyricsSegment;
  positionMs: number;
};

export const HighlightedWord: FC<HighlightedWordProps> = ({
  segment,
  positionMs,
}) => (
  <LyricsHighlighter
    progress={getTimingState(segment, positionMs).progress}
    className="duration-100"
  >
    <LyricsSegment segment={segment} />
  </LyricsHighlighter>
);
