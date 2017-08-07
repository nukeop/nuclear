import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

class VolumeSlider extends React.Component {

  render() {
    return (
      <div className={styles.volume_slider_container}>
        <div className={styles.volume_slider_bg}></div>
        <div style={{width: this.props.fill}} className={styles.volume_slider_fill}></div>
      </div>
    );
  }
}

export default VolumeSlider;
