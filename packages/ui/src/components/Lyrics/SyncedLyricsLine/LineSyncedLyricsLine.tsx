import { forwardRef } from 'react';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';

import { LineSyncedText } from './LineSyncedText';
import {
  SyncedLyricsLineShell,
  SyncedLyricsLineShellProps,
} from './SyncedLyricsLineShell';

type LineSyncedLyricsLineProps = Omit<
  SyncedLyricsLineShellProps,
  'children'
> & {
  line: SyncedLyricsLineModel<LyricsSegment>;
};

export const LineSyncedLyricsLine = forwardRef<
  HTMLButtonElement,
  LineSyncedLyricsLineProps
>(function LineSyncedLyricsLine({ line, positionMs, ...props }, ref) {
  return (
    <SyncedLyricsLineShell
      ref={ref}
      line={line}
      positionMs={positionMs}
      {...props}
    >
      <LineSyncedText line={line} positionMs={positionMs} />
    </SyncedLyricsLineShell>
  );
});
