import { ComponentProps, FC } from 'react';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';

import { cn } from '../../utils';
import {
  LyricsAnnotations,
  LyricsBackgroundVocals,
  LyricsSegments,
} from '../LyricsLineParts';
import { LyricsHighlighter } from './LyricsHighlighter';

type SyncedLyricsLineProps = Omit<ComponentProps<'button'>, 'children'> & {
  line: SyncedLyricsLineModel<LyricsSegment>;
  positionMs: number;
};

const getTimingState = (
  line: SyncedLyricsLineModel<LyricsSegment>,
  positionMs: number,
) => {
  const isPast = positionMs >= line.endMs;
  const isActive = !isPast && positionMs >= line.startMs;

  if (!isActive) {
    return { isPast, isActive, progress: 0 };
  }

  return {
    isPast,
    isActive,
    progress: (positionMs - line.startMs) / (line.endMs - line.startMs),
  };
};

export const SyncedLyricsLine: FC<SyncedLyricsLineProps> = ({
  line,
  positionMs,
  className,
  ...props
}) => {
  const { isPast, isActive, progress } = getTimingState(line, positionMs);

  return (
    <button
      type="button"
      className={cn(
        'text-foreground/60 hover:text-foreground block w-full cursor-pointer py-1 text-left transition-colors duration-100',
        isPast && 'text-foreground/40',
        isActive && 'text-foreground',
        className,
      )}
      {...props}
    >
      <span className="block">
        <LyricsHighlighter progress={progress}>
          <LyricsSegments segments={line.segments} />
        </LyricsHighlighter>
        {line.background && (
          <LyricsBackgroundVocals segments={line.background} />
        )}
      </span>
      {line.annotations && <LyricsAnnotations annotations={line.annotations} />}
    </button>
  );
};
