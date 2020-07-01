import React from 'react';

import Range from '../../Range';

import styles from './styles.scss';

export type VolumeSliderProps = {
  setVolume: (value: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
};

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  setVolume,
  toggleMute,
  isMuted
}) => (
    <div
      className={styles.volume_slider}
      onClick={isMuted ? toggleMute : () => { }}
    >
      <Range
        height={4}
        width='100%'
        onChange={setVolume}
      />
    </div>
  )

export default VolumeSlider;