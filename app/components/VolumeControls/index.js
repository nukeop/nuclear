import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

import PlayOptionsControls from '../PlayOptionsControls';
import VolumeSlider from './VolumeSlider';

class VolumeControls extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isVolumeMuted: false,
      volume: 100
    };
  }

  handleClick(value) {
    this.setState({
      volume: value,
      isVolumeMuted: this.state.isVolumeMuted && value === 0
    });
    return this.props.updateVolume(value);
  }

  toggleMute = () => {
    if (this.state.isVolumeMuted) {
      this.handleMuteOff();
    } else {
      this.handleMuteOn();
    }

    this.setState({
      isVolumeMuted: !this.state.isVolumeMuted
    });
  }

  handleMuteOn() {
    this.props.updateVolume(0);
  }

  handleMuteOff() {
    this.handleClick(this.state.volume);
  }

  render() {
    return (
      <div className={styles.volume_controls_container}>
        <PlayOptionsControls
          toggleOption={this.props.toggleOption}
          settings={this.props.settings}
        />
        <div className={styles.volume_speaker_control}
          onClick={this.toggleMute}>
          <FontAwesome name={this.state.isVolumeMuted ? 'volume-off' : 'volume-up'} />
        </div>

        <VolumeSlider
          fill={this.state.volume}
          handleClick={this.handleClick.bind(this)}
        />
      </div>
    );
  }
}

export default VolumeControls;
