import { FC } from 'react';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';

import { LyricsSegments } from '../LyricsLineParts';
import { getTimingState } from '../utils';
import { LyricsHighlighter } from './LyricsHighlighter';

type LineSyncedTextProps = {
  line: SyncedLyricsLineModel<LyricsSegment>;
  positionMs: number;
};

export const LineSyncedText: FC<LineSyncedTextProps> = ({
  line,
  positionMs,
}) => {
  const { isActive, progress } = getTimingState(line, positionMs);

  if (!isActive) {
    return <LyricsSegments segments={line.segments} />;
  }

  return (
    <LyricsHighlighter progress={progress}>
      <LyricsSegments segments={line.segments} />
    </LyricsHighlighter>
  );
};
