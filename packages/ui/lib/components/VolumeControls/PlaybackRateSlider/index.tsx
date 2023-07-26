import React from 'react';

import Range from '../../Range';
import NeumorphicBox from '../../NeumorphicBox';

import styles from './styles.scss';

export type PlaybackRateSliderProps = {
  playbackRate: number,
  isPlaybackRateOpen: boolean,
  updatePlaybackRate: (value: number) => void;
};

const PlaybackRateSliderColors = {
  fillColor: { r: 248, g: 248, b: 242, a: 1 },
  trackColor: { r: 68, g: 71, b: 90, a: 1 },
  thumbColor: { r: 248, g: 248, b: 242, a: 1 }
};

const PLAYBACK_RATES = ['0.5x', '0.75x', 'Normal', '1.25x', '1.5x'];

const PlaybackRateSlider: React.FC<PlaybackRateSliderProps> = ({
  playbackRate,
  updatePlaybackRate,
  isPlaybackRateOpen
}) => {
  
  const rateOptions = PLAYBACK_RATES.map((item, index) => <div key={index} onClick={() => updatePlaybackRate(index)}>{item}</div>);

  return (
    <div
      className={styles.rate_slider}
    >
      <NeumorphicBox
        borderRadius='10px'
      >
        <div className={styles.rates_box}>{rateOptions}</div>
        <Range  
          value={playbackRate}
          height={4}
          width='100%'
          onChange={updatePlaybackRate}
          min={0}
          max={4}
          fillColor={PlaybackRateSliderColors.fillColor}
          trackColor={PlaybackRateSliderColors.trackColor}
          thumbColor={PlaybackRateSliderColors.thumbColor}
        />
      </NeumorphicBox>
    </div>
  );
};

export default PlaybackRateSlider;
