import React from 'react';

import styles from './styles.scss';

import { PlayerControlsProps } from '../../PlayerControls';
import NeumorphicBox from '../../NeumorphicBox';
import PlayerButton from '../../PlayerButton';

const MiniPlayerControls: React.FC<PlayerControlsProps> = ({
  goForward,
  goBack,
  togglePlay,
  goBackDisabled = false,
  goForwardDisabled = false,
  playDisabled = false,
  isPlaying = false,
  isLoading = false
}) => <div className={styles.mini_player_controls}>
  <NeumorphicBox small borderRadius='5px'>
    <PlayerButton
      size='large'
      icon='step backward'
      onClick={goBack}
      disabled={goBackDisabled}
    />
  </NeumorphicBox>
  <NeumorphicBox
    small
    pressed={isPlaying}
    borderRadius='5px'
  >
    <PlayerButton
      size='large'
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
  </NeumorphicBox>
  <NeumorphicBox small borderRadius='5px'>
    <PlayerButton
      size='large'
      icon='step forward'
      onClick={goForward}
      disabled={goForwardDisabled}
    />
  </NeumorphicBox>
</div>;

export default MiniPlayerControls;
