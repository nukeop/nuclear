import {
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

import { Button } from '..';
import { cn } from '../../utils';

type PlayerBarControlsProps = {
  isPlaying?: boolean;
  isShuffleActive?: boolean;
  repeatMode?: RepeatMode;
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
  repeatMode = 'off',
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
      variant={repeatMode !== 'off' ? 'default' : 'text'}
      onClick={onRepeatToggle}
      data-testid="player-repeat-button"
    >
      {repeatMode === 'one' && <Repeat1 size={16} />}
      {repeatMode !== 'one' && <Repeat size={16} />}
    </Button>
  </div>
);
