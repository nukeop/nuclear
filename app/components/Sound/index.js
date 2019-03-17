import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

class Sound extends React.Component {
  audio;

  constructor(props) {
    super(props);

    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.attachRef = this.attachRef.bind(this);
  }

  attachRef(element) {
    this.audio = element;
  }

  handleTimeUpdate({ target }) {
    this.props.onPlaying({
      position: target.currentTime,
      duration: target.duration
    });
  }

  setPlayerState() {
    switch (this.props.playStatus) {
    case Sound.status.PAUSED:
      this.audio.pause();
      break;
    case Sound.status.PLAYING:
      this.audio.play();
      break;
    case Sound.status.STOPPED:
      this.audio.pause();
      this.audio.currentTime = 0;
      break;
    }
  }

  shouldUpdatePosition(previousPosition) {
    const dif = this.props.position - previousPosition;

    return (this.props.position < previousPosition) || (dif > 1);
  }

  setVolume() {
    this.audio.volume = this.props.volume / 100;
  }

  setPosition() {
    this.audio.currentTime = this.props.position;
  }

  componentDidUpdate(prevProps) {
    if (this.props.volume !== prevProps.volume) {
      this.setVolume();
    }

    if (this.shouldUpdatePosition(prevProps.position)) {
      this.setPosition();
    }

    if (this.props.playStatus !== prevProps.playStatus) {
      this.setPlayerState();
    }
  }

  componentDidMount() {
    this.setVolume();
    this.setPlayerState();
  }

  render() {
    const { url } = this.props;
 
    return (
      <audio
        autoPlay
        className={styles.sound}
        src={url}
        ref={this.attachRef}
        onTimeUpdate={this.handleTimeUpdate}
        onEnded={this.props.onFinishedPlaying}
        onLoadStart={this.props.onLoading}
        onLoad={this.props.onLoad}
      />
    );
  }
}

Sound.status = {
  PAUSED: 'PAUSED',
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED'
};

Sound.propTypes = {
  url: PropTypes.string,
  playStatus: PropTypes.oneOf(Object.values(Sound.status)),
  onPlaying: PropTypes.func,
  onFinishedPlaying: PropTypes.func,
  onLoading: PropTypes.func,
  onLoad: PropTypes.func,
  position: PropTypes.number,
  volume: PropTypes.number
};

export default Sound;

