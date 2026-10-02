import { FC } from 'react';

import type {
  SyncedLyricsLine as SyncedLyricsLineModel,
  TimedLyricsSegment,
} from '@nuclearplayer/model';

import { LyricsSegments } from '../LyricsLineParts';
import { getTimingState } from '../utils';
import { HighlightedWord } from './HighlightedWord';

type WordSyncedTextProps = {
  line: SyncedLyricsLineModel<TimedLyricsSegment>;
  positionMs: number;
};

export const WordSyncedText: FC<WordSyncedTextProps> = ({
  line,
  positionMs,
}) => {
  const { isActive } = getTimingState(line, positionMs);

  if (!isActive) {
    return <LyricsSegments segments={line.segments} />;
  }

  return line.segments.map((segment, index) => (
    <HighlightedWord key={index} segment={segment} positionMs={positionMs} />
  ));
};
