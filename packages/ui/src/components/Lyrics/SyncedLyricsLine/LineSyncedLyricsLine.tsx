import { ComponentProps, FC } from 'react';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';

import { LineSyncedText } from './LineSyncedText';
import { SyncedLyricsLineShell } from './SyncedLyricsLineShell';

type LineSyncedLyricsLineProps = Omit<
  ComponentProps<typeof SyncedLyricsLineShell>,
  'children'
> & {
  line: SyncedLyricsLineModel<LyricsSegment>;
};

export const LineSyncedLyricsLine: FC<LineSyncedLyricsLineProps> = ({
  line,
  positionMs,
  ...props
}) => (
  <SyncedLyricsLineShell line={line} positionMs={positionMs} {...props}>
    <LineSyncedText line={line} positionMs={positionMs} />
  </SyncedLyricsLineShell>
);
