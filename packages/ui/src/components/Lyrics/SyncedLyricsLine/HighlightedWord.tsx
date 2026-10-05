import { CSSProperties, FC } from 'react';

import type { TimedLyricsSegment } from '@nuclearplayer/model';

import { LyricsSegment } from '../LyricsLineParts';
import { getTimingState } from '../utils';

type HighlightedWordProps = {
  segment: TimedLyricsSegment;
  positionMs: number;
};

const fillWidth = (progress: number) =>
  ({ '--fill-width': `calc((100% + 1px) * ${progress})` }) as CSSProperties;

export const HighlightedWord: FC<HighlightedWordProps> = ({
  segment,
  positionMs,
}) => {
  const { hasStarted, progress } = getTimingState(segment, positionMs);

  return (
    <span
      data-testid="lyrics-word"
      data-active={hasStarted}
      className="before:bg-primary relative isolate before:absolute before:bottom-0 before:-left-px before:-z-10 before:h-2/5 before:w-(--fill-width)"
      style={fillWidth(progress)}
    >
      <LyricsSegment segment={segment} />
    </span>
  );
};
