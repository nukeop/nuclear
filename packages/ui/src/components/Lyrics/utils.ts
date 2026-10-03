import clamp from 'lodash-es/clamp';

import type { LyricsSection } from '@nuclearplayer/model';

type TimeRange = {
  startMs: number;
  endMs: number;
};

export const getTimingState = (range: TimeRange, positionMs: number) => {
  const isPast = positionMs >= range.endMs;

  return {
    isPast,
    isActive: !isPast && positionMs >= range.startMs,
    progress: clamp(
      (positionMs - range.startMs) / (range.endMs - range.startMs),
      0,
      1,
    ),
  };
};

export const flattenLines = <TLine>(sections: LyricsSection<TLine>[]) =>
  sections.flatMap((section) => section.lines);
