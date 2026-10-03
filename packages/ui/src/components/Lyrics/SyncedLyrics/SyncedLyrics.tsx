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
};

export const SyncedLyrics: FC<SyncedLyricsProps> = ({
  lyrics,
  positionMs,
  onSeek,
  labels,
  viewportRef,
  className,
  ...props
}) => {
  const {
    activeLineRef,
    activeLineIndex,
    isFollowing,
    stopFollowing,
    resumeFollowing,
    seekToLine,
  } = useSyncedLyrics({ lyrics, positionMs, onSeek, viewportRef });

  return (
    <div
      onWheel={stopFollowing}
      className={cn(
        'font-heading contents text-3xl leading-tight font-bold tracking-tight font-stretch-semi-condensed',
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
        onLineClick={seekToLine}
      />
      <div className="h-8/10 shrink-0" />
      {!isFollowing && (
        <CurrentLinePill
          viewportRef={viewportRef}
          activeLineRef={activeLineRef}
          activeLineIndex={activeLineIndex}
          label={labels.currentLine}
          onClick={resumeFollowing}
        />
      )}
    </div>
  );
};
