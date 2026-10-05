import clamp from 'lodash-es/clamp';

import type { LyricsSection } from '@nuclearplayer/model';

type TimeRange = {
  startMs: number;
  endMs: number;
};

export const getTimingState = (range: TimeRange, positionMs: number) => {
  const isPast = positionMs >= range.endMs;
  const hasStarted = positionMs >= range.startMs;

  return {
    isPast,
    hasStarted,
    isActive: !isPast && hasStarted,
    progress: clamp(
      (positionMs - range.startMs) / (range.endMs - range.startMs),
      0,
      1,
    ),
  };
};

export const flattenLines = <TLine>(sections: LyricsSection<TLine>[]) =>
  sections.flatMap((section) => section.lines);

const minimumTimeToShowBreak = 5000;
export const getBreakBefore = (lines: TimeRange[], index: number) => {
  const gap = {
    startMs: lines[index - 1]?.endMs ?? 0,
    endMs: lines[index].startMs,
  };
  if (gap.endMs - gap.startMs < minimumTimeToShowBreak) {
    return undefined;
  }
  return gap;
};
