import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

import PlayOptionsControls from '../PlayOptionsControls';
import VolumeSlider from './VolumeSlider';

class VolumeControls extends React.Component {

  handleClick(width) {
    return event => {
      let volume = event.nativeEvent.offsetX / width * 100;
      this.props.updateVolume(volume);
    };
  }
  
  render() {
    return (
      <div className={styles.volume_controls_container}>
        <PlayOptionsControls
          toggleOption={this.props.toggleOption}
          settings={this.props.settings}
        />
        <FontAwesome name='volume-up'/>
        <VolumeSlider
          fill={this.props.fill}
          handleClick={this.handleClick.bind(this)}
	      />
      </div>
    );
  }
}

export default VolumeControls;
