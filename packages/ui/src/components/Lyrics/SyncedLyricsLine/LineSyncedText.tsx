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
  const { isActive } = getTimingState(line, positionMs);

  return (
    <LyricsHighlighter progress={isActive ? 1 : 0} className="ease-out">
      <LyricsSegments segments={line.segments} />
    </LyricsHighlighter>
  );
};
