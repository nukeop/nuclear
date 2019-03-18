import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './styles.scss';

const filterValues = [500, 1500, 2500, 4000, 6500, 8500, 12000, 16000];

const qValues = filterValues.map((freq, i, arr) => {
  if (!i || i === arr.length - 1) {
    return null;
  } else {
    return 2 * freq / Math.abs(arr[i + 1] - arr[i - 1]);
  }
});

class Sound extends React.Component {
  audio;
  audioContext;
  gainNode;
  source;
  filters = [];

  constructor(props) {
    super(props);

    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.attachRef = this.attachRef.bind(this);
  }

  attachRef(element) {
    if (element) {
      this.audio = element;
      this.audio.crossOrigin = 'anonymous';
    }
  }

  createFilterNodes() {
    let lastInChain = this.gainNode;

    filterValues.forEach((freq, i, arr) => {
      const biquadFilter = this.audioContext.createBiquadFilter();

      biquadFilter.type = 'peaking';
      biquadFilter.frequency.value = freq;
      biquadFilter.gain.value = this.props.equalizer[i] || 0;
      if (!i || i === arr.length - 1) {
        biquadFilter.type = i ? 'highshelf' : 'lowshelf';
      } else {
        biquadFilter.Q.value = qValues[i];
      }
  
      if (lastInChain) {
        lastInChain.connect(biquadFilter);
      }

      lastInChain = biquadFilter;
  
      this.filters.push(biquadFilter);
    });
  
    return lastInChain;
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
    this.gainNode.gain.value = this.props.volume / 100;
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

    if (!_.isEqual(this.props.equalizer, prevProps.equalizer)) {
      this.props.equalizer.forEach((value, idx) => {
        this.filters[idx].gain.value = value;
      });
    }
  }

  componentDidMount() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.source = this.audioContext.createMediaElementSource(this.audio);

    this.source.connect(this.gainNode);
    this.createFilterNodes().connect(this.audioContext.destination);

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
  volume: PropTypes.number,
  equalizer: PropTypes.arrayOf(PropTypes.number)
};

export default Sound;

