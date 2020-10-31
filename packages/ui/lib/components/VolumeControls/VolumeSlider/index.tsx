import React, {useState, useEffect, useCallback, useRef} from 'react';

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

// 767 px to match the Semantic UI small screen breakpoint
const smallScreenBreak = 767;
const volumeSliderWidths = {
  big: '100%',
  small: '65%'
};

const defaultVolumeSliderWidth = () => {
  if (window.innerWidth > smallScreenBreak) {
    return volumeSliderWidths.big;
  }
  return volumeSliderWidths.small;
};

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  updateVolume,
  toggleMute,
  isMuted
}) => {

  const [volumeSliderWidth, setVolumeSliderWidth] = useState(defaultVolumeSliderWidth());
  const volumeSliderRef = useRef(null);

  // prevent function redefinition to prevent useEffect
  // from firing and adding redundant event listeners
  const computeVolumeSliderWidth = useCallback(() => {
    const currentWidth = volumeSliderRef.current.style.width;
    if (window.innerWidth > smallScreenBreak && currentWidth !== volumeSliderWidths.big) {
      setVolumeSliderWidth(volumeSliderWidths.big);
    } else if (window.innerWidth <= smallScreenBreak && currentWidth !== volumeSliderWidths.small){
      setVolumeSliderWidth(volumeSliderWidths.small);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', computeVolumeSliderWidth);

    // remove listener when component unmounts
    return (() => window.removeEventListener('resize', computeVolumeSliderWidth));
  }, [computeVolumeSliderWidth]);

  return (
    <div
      className={styles.volume_slider}
      onClick={isMuted ? toggleMute : () => { }}
    >
      <Range
        value={volume}
        height={4}
        width={volumeSliderWidth}
        onChange={updateVolume}
        fillColor={volumeSliderColors.fillColor}
        trackColor={volumeSliderColors.trackColor}
        thumbColor={volumeSliderColors.thumbColor}
        rangeRef={volumeSliderRef}
      />
    </div>
  );
};

export default VolumeSlider;

