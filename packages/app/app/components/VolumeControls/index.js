import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

import PlayOptionsControls from '../PlayOptionsControls';
import VolumeSlider from './VolumeSlider';

class VolumeControls extends React.Component {
  handleClick (value) {
    return this.props.updateVolume(value);
  }

  toggleMute () {
    this.props.toggleMute(!this.props.muted);
  }

  render () {
    return (
      <div className={styles.volume_controls_container}>
        <PlayOptionsControls
          toggleOption={this.props.toggleOption}
          settings={this.props.settings}
        />
        <div
          className={styles.volume_speaker_control}
          onClick={this.toggleMute.bind(this)}
        >
          <FontAwesome name={this.props.muted ? 'volume-off' : this.props.fill > 40 ? 'volume-up' : 'volume-down'}/>
        </div>

        <VolumeSlider
          fill={this.props.muted ? 0 : this.props.fill}
          handleClick={this.handleClick.bind(this)}
          muted={this.props.muted}
          toggleMute={this.toggleMute.bind(this)}
        />
      </div>
    );
  }
}

export default VolumeControls;
