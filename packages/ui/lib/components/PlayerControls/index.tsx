import React from 'react';

import PlayerButton from '../PlayerButton';

import styles from './styles.scss';

export type PlayerControlsProps = {
  goForward?: () => void;
  goBack?: () => void;
  togglePlay?: () => void;
  isPlaying?: boolean;
  isLoading?: boolean;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({
  goForward,
  goBack,
  togglePlay,
  isPlaying,
  isLoading
}) => (
    <div className={styles.player_controls}>
      <PlayerButton
        icon='step backward'
        size='large'
        onClick={goBack}
      />
      <PlayerButton
      loading={isLoading}
        icon={
          isLoading
          ? 'spinner'
          : isPlaying
          ? 'pause'
          : 'play'
        }
        onClick={togglePlay}
      />
      <PlayerButton
        icon='step forward'
        size='large'
        onClick={goForward}
      />
    </div>
  )

export default PlayerControls;