import { ComponentProps, FC } from 'react';

import type {
  SyncedLyricsLine as SyncedLyricsLineModel,
  TimedLyricsSegment,
} from '@nuclearplayer/model';

import { SyncedLyricsLineShell } from './SyncedLyricsLineShell';
import { WordSyncedText } from './WordSyncedText';

type WordSyncedLyricsLineProps = Omit<
  ComponentProps<typeof SyncedLyricsLineShell>,
  'children'
> & {
  line: SyncedLyricsLineModel<TimedLyricsSegment>;
};

export const WordSyncedLyricsLine: FC<WordSyncedLyricsLineProps> = ({
  line,
  positionMs,
  ...props
}) => (
  <SyncedLyricsLineShell line={line} positionMs={positionMs} {...props}>
    <WordSyncedText line={line} positionMs={positionMs} />
  </SyncedLyricsLineShell>
);
