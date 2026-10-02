import { ComponentProps, FC } from 'react';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';

import { cn } from '../../../utils';
import { LyricsAnnotations, LyricsBackgroundVocals } from '../LyricsLineParts';
import { getTimingState } from '../utils';

type SyncedLyricsLineShellProps = ComponentProps<'button'> & {
  line: SyncedLyricsLineModel<LyricsSegment>;
  positionMs: number;
};

export const SyncedLyricsLineShell: FC<SyncedLyricsLineShellProps> = ({
  line,
  positionMs,
  className,
  children,
  ...props
}) => {
  const { isPast, isActive } = getTimingState(line, positionMs);

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
        {children}
        {line.background && (
          <LyricsBackgroundVocals segments={line.background} />
        )}
      </span>
      {line.annotations && <LyricsAnnotations annotations={line.annotations} />}
    </button>
  );
};
