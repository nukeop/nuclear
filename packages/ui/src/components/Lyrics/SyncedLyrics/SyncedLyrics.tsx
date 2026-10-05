import { ComponentProps, FC, RefObject } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import { cn } from '../../../utils';
import { CurrentLinePill } from './CurrentLinePill';
import { SyncedLyricsLines } from './SyncedLyricsLines';
import { useSyncedLyrics } from './useSyncedLyrics';

type SyncedLyricsLabels = {
  currentLine: string;
};

type SyncedLyricsProps = Omit<ComponentProps<'div'>, 'children'> & {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  positionMs: number;
  onSeek: (positionMs: number) => void;
  labels: SyncedLyricsLabels;
  viewportRef: RefObject<HTMLDivElement>;
  autoScroll: boolean;
};

export const SyncedLyrics: FC<SyncedLyricsProps> = ({
  lyrics,
  positionMs,
  onSeek,
  labels,
  viewportRef,
  autoScroll,
  className,
  ...props
}) => {
  const {
    activeLineRef,
    activeLineIndex,
    activeLineDirection,
    scrollToActiveLine,
  } = useSyncedLyrics({ lyrics, positionMs, viewportRef, autoScroll });

  return (
    <div
      className={cn(
        'font-heading contents leading-tight font-bold tracking-tight font-stretch-semi-condensed',
        className,
      )}
      {...props}
    >
      <div className="h-2/10 shrink-0" />
      <SyncedLyricsLines
        lyrics={lyrics}
        positionMs={positionMs}
        activeLineIndex={activeLineIndex}
        activeLineRef={activeLineRef}
        onLineClick={onSeek}
      />
      <div className="h-8/10 shrink-0" />
      {activeLineDirection && (
        <CurrentLinePill
          direction={activeLineDirection}
          label={labels.currentLine}
          onClick={scrollToActiveLine}
        />
      )}
    </div>
  );
};
