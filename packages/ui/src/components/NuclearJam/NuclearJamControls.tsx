import {
  BoomBox,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { FC } from 'react';

import { RepeatMode } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeSeconds } from '../../utils/time';
import { Button } from '../Button';
import { useSeekBar } from '../PlayerBar/useSeekBar';

export type NuclearJamControlsProps = {
  isPlaying: boolean;
  isLoading?: boolean;
  shuffleActive: boolean;
  repeatMode: RepeatMode;
  isDiscoveryActive?: boolean;
  progress: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onDiscoveryToggle?: () => void;
  onSeek: (percent: number) => void;
  className?: string;
};

export const NuclearJamControls: FC<NuclearJamControlsProps> = ({
  isPlaying,
  isLoading = false,
  shuffleActive,
  repeatMode,
  isDiscoveryActive = false,
  progress,
  elapsedSeconds,
  remainingSeconds,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffleToggle,
  onRepeatToggle,
  onDiscoveryToggle,
  onSeek,
  className,
}) => {
  const { clamped, containerRef, handleClick, isInteractive } = useSeekBar({
    progress,
    isLoading,
    onSeek,
  });

  return (
    <div
      className={cn(
        'border-border shrink-0 border-y-(length:--border-width) px-4 py-4',
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <Button
          size="icon"
          variant="text"
          onClick={onPrevious}
          data-testid="jam-previous-button"
        >
          <SkipBack size={24} />
        </Button>

        <Button
          size="icon"
          variant="default"
          onClick={onPlayPause}
          className="size-14"
          data-testid={isPlaying ? 'jam-pause-button' : 'jam-play-button'}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </Button>

        <Button
          size="icon"
          variant="text"
          onClick={onNext}
          data-testid="jam-next-button"
        >
          <SkipForward size={24} />
        </Button>
      </div>

      <div className="mt-3 w-full select-none">
        <div
          ref={containerRef}
          className={cn(
            'border-border bg-background-secondary relative h-5 w-full overflow-hidden rounded-md border-(length:--border-width)',
            {
              'cursor-pointer': isInteractive,
              'pointer-events-none': isLoading,
            },
          )}
          onClick={handleClick}
        >
          <div className="absolute right-0 left-0 z-10 flex h-full items-center justify-between px-2 text-xs">
            <span className="text-foreground tabular-nums">
              {formatTimeSeconds(elapsedSeconds)}
            </span>
            <span className="text-foreground tabular-nums">
              {formatTimeSeconds(-Math.abs(remainingSeconds))}
            </span>
          </div>
          {isLoading ? (
            <div className="bg-stripes-diagonal absolute inset-0 opacity-80" />
          ) : (
            <div
              className="bg-primary h-full transition-none"
              style={{ width: `${clamped}%` }}
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Button
          size="icon"
          variant={shuffleActive ? 'default' : 'text'}
          onClick={onShuffleToggle}
          data-testid="jam-shuffle-button"
        >
          <Shuffle size={18} />
        </Button>

        <Button
          size="icon"
          variant={repeatMode !== 'off' ? 'default' : 'text'}
          onClick={onRepeatToggle}
          data-testid="jam-repeat-button"
        >
          {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
        </Button>

        {onDiscoveryToggle && (
          <Button
            size="icon"
            variant={isDiscoveryActive ? 'default' : 'text'}
            onClick={onDiscoveryToggle}
            data-testid="jam-discovery-button"
          >
            <BoomBox size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};
