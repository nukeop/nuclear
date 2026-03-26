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

import { Button } from '..';
import { cn } from '../../utils';
import { Tooltip } from '../Tooltip';

type PlayerBarControlsLabels = {
  shuffleOn?: string;
  shuffleOff?: string;
  repeatOff?: string;
  repeatAll?: string;
  repeatOne?: string;
  discoveryOn?: string;
  discoveryOff?: string;
};

const REPEAT_LABEL_KEY: Record<RepeatMode, keyof PlayerBarControlsLabels> = {
  off: 'repeatOff',
  all: 'repeatAll',
  one: 'repeatOne',
};

type PlayerBarControlsProps = {
  isPlaying?: boolean;
  isShuffleActive?: boolean;
  isDiscoveryActive?: boolean;
  repeatMode?: RepeatMode;
  labels: PlayerBarControlsLabels;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onDiscoveryToggle?: () => void;
  showDiscovery: boolean;
  className?: string;
};

export const PlayerBarControls: FC<PlayerBarControlsProps> = ({
  isPlaying = false,
  isShuffleActive = false,
  isDiscoveryActive = false,
  repeatMode = 'off',
  labels,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffleToggle,
  onRepeatToggle,
  onDiscoveryToggle,
  showDiscovery,
  className = '',
}) => (
  <div className={cn('flex items-center justify-center gap-2', className)}>
    <Tooltip
      content={isShuffleActive ? labels?.shuffleOn : labels?.shuffleOff}
      side="top"
    >
      <Button
        size="icon"
        variant={isShuffleActive ? 'default' : 'text'}
        onClick={onShuffleToggle}
        data-testid="player-shuffle-button"
      >
        <Shuffle size={16} />
      </Button>
    </Tooltip>
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
    <Tooltip content={labels?.[REPEAT_LABEL_KEY[repeatMode]]} side="top">
      <Button
        size="icon"
        variant={repeatMode !== 'off' ? 'default' : 'text'}
        onClick={onRepeatToggle}
        data-testid="player-repeat-button"
      >
        {repeatMode === 'one' && <Repeat1 size={16} />}
        {repeatMode !== 'one' && <Repeat size={16} />}
      </Button>
    </Tooltip>
    {showDiscovery && (
      <Tooltip
        content={isDiscoveryActive ? labels?.discoveryOn : labels?.discoveryOff}
        side="top"
      >
        <Button
          size="icon"
          variant={isDiscoveryActive ? 'default' : 'text'}
          onClick={onDiscoveryToggle}
          data-testid="player-discovery-button"
        >
          <BoomBox size={16} />
        </Button>
      </Tooltip>
    )}
  </div>
);
