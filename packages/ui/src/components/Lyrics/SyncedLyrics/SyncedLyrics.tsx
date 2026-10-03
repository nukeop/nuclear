import { ComponentProps, FC } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import { cn } from '../../../utils';
import { ScrollableArea } from '../../ScrollableArea';
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
};

export const SyncedLyrics: FC<SyncedLyricsProps> = ({
  lyrics,
  positionMs,
  onSeek,
  labels,
  className,
  ...props
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
      {...props}
    >
      <ScrollableArea
        viewportRef={viewportRef}
        viewportClassName="relative scroll-smooth mask-y-from-90%"
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
