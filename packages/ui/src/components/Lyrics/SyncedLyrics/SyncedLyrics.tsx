import { FC } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import { cn } from '../../../utils';
import { ScrollableArea } from '../../ScrollableArea';
import { CurrentLinePill } from './CurrentLinePill';
import { SyncedLyricsLines } from './SyncedLyricsLines';
import { useSyncedLyrics } from './useSyncedLyrics';

type SyncedLyricsLabels = {
  currentLine: string;
};

type SyncedLyricsProps = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  positionMs: number;
  onSeek: (positionMs: number) => void;
  labels: SyncedLyricsLabels;
  className?: string;
};

export const SyncedLyrics: FC<SyncedLyricsProps> = ({
  lyrics,
  positionMs,
  onSeek,
  labels,
  className,
}) => {
  const {
    viewportRef,
    activeLineRef,
    activeLineIndex,
    isFollowing,
    stopFollowing,
    resumeFollowing,
    seekToLine,
  } = useSyncedLyrics({ lyrics, positionMs, onSeek });

  return (
    <div
      onWheel={stopFollowing}
      className={cn(
        'font-heading relative min-h-0 text-3xl leading-tight font-bold tracking-tight font-stretch-semi-condensed',
        className,
      )}
    >
      <ScrollableArea
        viewportRef={viewportRef}
        viewportClassName="relative scroll-smooth mask-y-from-90% pt-8 pb-64"
      >
        <SyncedLyricsLines
          lyrics={lyrics}
          positionMs={positionMs}
          activeLineIndex={activeLineIndex}
          activeLineRef={activeLineRef}
          onLineClick={seekToLine}
        />
      </ScrollableArea>
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
