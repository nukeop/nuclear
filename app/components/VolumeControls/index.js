import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.css';

import VolumeSlider from './VolumeSlider';

class VolumeControls extends React.Component {

  render() {
    return (
      <div className={styles.volume_controls_container}>
        <FontAwesome name="volume-up"/>
        <VolumeSlider fill={this.props.fill}/>
      </div>
    );
  }
}

export default VolumeControls;
