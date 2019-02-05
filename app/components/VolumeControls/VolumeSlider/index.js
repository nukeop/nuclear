import React from 'react';

import styles from './styles.scss';
import Range from 'react-range-progress';

const volumeSliderColors = {
  fillColor: { r: 248, g: 248, b: 242, a: 1 },
  trackColor: { r: 68, g: 71, b: 90, a: 1 },
  thumbColor: { r: 248, g: 248, b: 242, a: 1 }
};

class VolumeSlider extends React.Component {

  handleClick (value) {
    this.props.handleClick(value);
  }

  render () {
    return (
      <div className={styles.volume_slider_container}>
        <Range
          value={this.props.fill}
          fillColor={volumeSliderColors.fillColor}
          trackColor={volumeSliderColors.trackColor}
          thumbColor={volumeSliderColors.thumbColor}
          height={4}
          width='100%'
          onChange={this.handleClick.bind(this)}
        />
      </div>
    );
  }
}

export default VolumeSlider;
