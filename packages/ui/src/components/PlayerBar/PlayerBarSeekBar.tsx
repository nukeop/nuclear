import { FC } from 'react';

import '../../styles.css';

import { cn } from '../../utils';
import { formatTimeSeconds } from '../../utils/time';
import { useSeekBar } from './useSeekBar';

export type PlayerSeekBarProps = {
  progress: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  isLoading?: boolean;
  onSeek?: (percent: number) => void;
  className?: string;
};

export const PlayerBarSeekBar: FC<PlayerSeekBarProps> = ({
  progress,
  elapsedSeconds,
  remainingSeconds,
  isLoading = false,
  onSeek,
  className = '',
}) => {
  const { clamped, containerRef, handleClick, isInteractive } = useSeekBar({
    progress,
    isLoading,
    onSeek,
  });

  return (
    <div className={cn('w-full select-none', className)}>
      <div
        ref={containerRef}
        className={cn('relative h-4 w-full', {
          'pointer-events-none cursor-not-allowed': isLoading,
          'cursor-pointer': isInteractive,
        })}
        onClick={handleClick}
        aria-disabled={isLoading}
      >
        <div className="absolute right-0 left-0 z-10 flex h-full flex-row items-center justify-between px-2 pt-0.5 text-xs leading-none">
          <span className="text-foreground-secondary tabular-nums">
            {formatTimeSeconds(elapsedSeconds)}
          </span>
          <span className="text-foreground-secondary tabular-nums">
            {formatTimeSeconds(-Math.abs(remainingSeconds))}
          </span>
        </div>
        <div
          className={cn(
            'border-border bg-background-secondary absolute inset-0 border-t-(length:--border-width)',
            {
              'overflow-hidden': isLoading,
            },
          )}
        >
          {isLoading && (
            <div className="bg-stripes-diagonal absolute inset-0 opacity-80" />
          )}
          {!isLoading && (
            <div
              className={cn('bg-primary h-full', 'transition-none')}
              style={{ width: `${clamped}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
