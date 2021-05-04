import React from 'react';

import Range from '../../Range';

import styles from './styles.scss';

export type VolumeSliderProps = {
  volume: number;
  updateVolume: (value: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
};

const volumeSliderColors = {
  fillColor: { r: 248, g: 248, b: 242, a: 1 },
  trackColor: { r: 68, g: 71, b: 90, a: 1 },
  thumbColor: { r: 248, g: 248, b: 242, a: 1 }
};

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  updateVolume,
  toggleMute,
  isMuted
}) => (
  <div
    className={styles.volume_slider}
    onClick={isMuted ? toggleMute : () => { }}
  >
    <Range
      value={volume}
      height={4}
      width='100%'
      onChange={updateVolume}
      fillColor={volumeSliderColors.fillColor}
      trackColor={volumeSliderColors.trackColor}
      thumbColor={volumeSliderColors.thumbColor}
    />
  </div>
);

export default VolumeSlider;
