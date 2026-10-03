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
}) => {
  const { hasStarted, progress } = getTimingState(segment, positionMs);

  return (
    <LyricsHighlighter
      data-testid="lyrics-word"
      data-active={hasStarted}
      progress={progress}
      className="duration-100"
    >
      <LyricsSegment segment={segment} />
    </LyricsHighlighter>
  );
};
