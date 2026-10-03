import { forwardRef } from 'react';

import type {
  SyncedLyricsLine as SyncedLyricsLineModel,
  TimedLyricsSegment,
} from '@nuclearplayer/model';

import {
  SyncedLyricsLineShell,
  SyncedLyricsLineShellProps,
} from './SyncedLyricsLineShell';
import { WordSyncedText } from './WordSyncedText';

type WordSyncedLyricsLineProps = Omit<
  SyncedLyricsLineShellProps,
  'children'
> & {
  line: SyncedLyricsLineModel<TimedLyricsSegment>;
};

export const WordSyncedLyricsLine = forwardRef<
  HTMLButtonElement,
  WordSyncedLyricsLineProps
>(function WordSyncedLyricsLine({ line, positionMs, ...props }, ref) {
  return (
    <SyncedLyricsLineShell
      ref={ref}
      line={line}
      positionMs={positionMs}
      {...props}
    >
      <WordSyncedText line={line} positionMs={positionMs} />
    </SyncedLyricsLineShell>
  );
});
