import React from 'react';

import styles from './styles.scss';

import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';
import Spacer from '../Spacer';

class PlayerControls extends React.Component {
  render() {
    return (
      <div className={styles.player_controls_container}>
        <Spacer />
        <PlayerButton onClick={this.props.back} icon="step-backward" />
        <PlayPauseButton onClick={this.props.togglePlay} playing={this.props.playing} />
        <PlayerButton onClick={this.props.forward} icon="step-forward" />
        <Spacer />
      </div>
    );
  }
}

export default PlayerControls;
