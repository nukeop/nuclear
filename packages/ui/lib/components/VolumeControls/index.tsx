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
    <div className={styles.volume_controls_container}>
      <PlayOptions playOptions={playOptions} />
      <div className={styles.volume_controls}>
        <div className={styles.volume_icon}>
      <Icon
        onClick={toggleMute}
        size='large'
        name={
          isMuted
            ? 'volume off'
            : volume > 40
              ? 'volume up'
              : 'volume down'
        }
      />
      </div>
      <VolumeSlider
        setVolume={setVolume}
        toggleMute={toggleMute}
        isMuted={isMuted}
      />
      </div>
    </div>
  );

export default VolumeControls;