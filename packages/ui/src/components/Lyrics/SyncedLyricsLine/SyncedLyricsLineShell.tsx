import { ComponentPropsWithoutRef, forwardRef } from 'react';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';

import { cn } from '../../../utils';
import { LyricsAnnotations, LyricsBackgroundVocals } from '../LyricsLineParts';
import { getTimingState } from '../utils';

export type SyncedLyricsLineShellProps = ComponentPropsWithoutRef<'button'> & {
  line: SyncedLyricsLineModel<LyricsSegment>;
  positionMs: number;
};

export const SyncedLyricsLineShell = forwardRef<
  HTMLButtonElement,
  SyncedLyricsLineShellProps
>(function SyncedLyricsLineShell(
  { line, positionMs, className, children, ...props },
  ref,
) {
  const { isPast, isActive } = getTimingState(line, positionMs);

  return (
    <button
      ref={ref}
      type="button"
      data-testid="lyrics-line"
      data-active={isActive}
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
});
