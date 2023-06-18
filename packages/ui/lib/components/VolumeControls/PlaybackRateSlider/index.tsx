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

const PlaybackRateSlider: React.FC<PlaybackRateSliderProps> = ({
  playbackRate,
  updatePlaybackRate,
  isPlaybackRateOpen
}) => (
  <div
    className={styles.rate_slider}
    // onClick={}
  >
    <NeumorphicBox
      borderRadius='10px'
    >
      <div className={styles.rate_box}>
        {/* <div>0.25x</div> */}
        <div>0.5x</div>
        <div>0.75x</div>
        <div>Normal</div>
        <div>1.25x</div>
        <div>1.5x</div>
        {/* <div>1.75x</div>
        <div>2x</div> */}
      </div>
      <Range  
        value={playbackRate}
        height={4}
        width='100%'
        onChange={updatePlaybackRate}
        min={0}
        max={4}
        // step={0.25}
        fillColor={PlaybackRateSliderColors.fillColor}
        trackColor={PlaybackRateSliderColors.trackColor}
        thumbColor={PlaybackRateSliderColors.thumbColor}
      />
    </NeumorphicBox>
  </div>
);

export default PlaybackRateSlider;
