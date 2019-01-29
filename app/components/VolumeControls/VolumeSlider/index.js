import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';
import Range from 'react-range-progress';

class VolumeSlider extends React.Component {

  handleClick(value) {
    this.props.handleClick(value);
  }

  render() {
    return (
      <div className={styles.volume_slider_container}>
        <Range
          value={this.props.fill}
          fillColor={volume_slider_colors.fillColor}
          trackColor={volume_slider_colors.trackColor}
          thumbColor={volume_slider_colors.thumbColor}
          height={4}
          width='100%'
          onChange={this.handleClick.bind(this)}
        />
      </div>
    );
  }
}

const volume_slider_colors = {
  fillColor: { r: 248, g: 248, b: 242, a: 1 },
  trackColor: { r: 248, g: 248, b: 242, a: 0.75 },
  thumbColor: { r: 248, g: 248, b: 242, a: 1 }
};

export default VolumeSlider;
