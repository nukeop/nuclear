import React from 'react';

import PlayerButton from '../PlayerButton';

import styles from './styles.scss';

export type PlayerControlsProps = {
  goForward?: () => void;
  goBack?: () => void;
  togglePlay?: () => void;
  isPlaying?: boolean;
  isLoading?: boolean;

  goBackDisabled?: boolean;
  goForwardDisabled?: boolean;
  playDisabled?: boolean;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({
  goForward,
  goBack,
  togglePlay,
  isPlaying,
  isLoading,
  goBackDisabled=false,
  goForwardDisabled=false,
  playDisabled=false
}) => {
  return (
    <div className={styles.player_controls}>
      <PlayerButton
        data-testid='player-controls-back'
        icon='step backward'
        size='large'
        onClick={goBack}
        disabled={goBackDisabled}
      />
      <PlayerButton
        data-testid='player-controls-play'
        loading={isLoading}
        icon={
          isLoading
            ? 'circle notch'
            : isPlaying
              ? 'pause'
              : 'play'
        }
        onClick={togglePlay}
        disabled={playDisabled}
      />
      <PlayerButton
        data-testid='player-controls-forward'
        icon='step forward'
        size='large'
        onClick={goForward}
        disabled={goForwardDisabled}
      />
    </div>
  );
};

export default PlayerControls;
