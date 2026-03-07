import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { FC } from 'react';

import { Button } from '..';
import { cn } from '../../utils';

type PlayerBarControlsProps = {
  isPlaying?: boolean;
  isShuffleActive?: boolean;
  isRepeatActive?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  className?: string;
};

export const PlayerBarControls: FC<PlayerBarControlsProps> = ({
  isPlaying = false,
  isShuffleActive = false,
  isRepeatActive = false,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffleToggle,
  onRepeatToggle,
  className = '',
}) => (
  <div className={cn('flex items-center justify-center gap-2', className)}>
    <Button
      size="icon"
      variant={isShuffleActive ? 'default' : 'text'}
      onClick={onShuffleToggle}
      data-testid="player-shuffle-button"
    >
      <Shuffle size={16} />
    </Button>
    <Button size="icon" variant="text" onClick={onPrevious}>
      <SkipBack size={16} />
    </Button>
    <Button
      size="icon"
      onClick={onPlayPause}
      data-testid={isPlaying ? 'player-pause-button' : 'player-play-button'}
    >
      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
    </Button>
    <Button size="icon" variant="text" onClick={onNext}>
      <SkipForward size={16} />
    </Button>
    <Button
      size="icon"
      variant={isRepeatActive ? 'default' : 'text'}
      onClick={onRepeatToggle}
      data-testid="player-repeat-button"
    >
      <Repeat size={16} />
    </Button>
  </div>
);
