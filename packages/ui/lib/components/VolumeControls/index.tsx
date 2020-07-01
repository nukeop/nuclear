import React from 'react';
import { Icon } from 'semantic-ui-react';

import VolumeSlider, { VolumeSliderProps } from './VolumeSlider';
import PlayOptions, { PlayOptionsProps } from './PlayOptions';

import styles from './styles.scss';

export type VolumeControlsProps = VolumeSliderProps & PlayOptionsProps & {
  volume: number;
};

const VolumeControls: React.FC<VolumeControlsProps> = ({
  volume,
  setVolume,
  toggleMute,
  isMuted,
  playOptions
}) => (
    <div className={styles.volume_controls}>
      <PlayOptions playOptions={playOptions} />
      <Icon
      className={styles.volume_icon}
        onClick={toggleMute}
        size='big'
        name={
          isMuted
            ? 'volume off'
            : volume > 40
              ? 'volume up'
              : 'volume down'
        }
      />
      <VolumeSlider
        setVolume={setVolume}
        toggleMute={toggleMute}
        isMuted={isMuted}
      />
    </div>
  );

export default VolumeControls;