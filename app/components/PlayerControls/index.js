import React from 'react';

import styles from './styles.css';

import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';
import Spacer from '../Spacer';

class PlayerControls extends React.Component {
  render() {
    return (
      <div className={styles.player_controls_container}>
        <Spacer />
        <PlayerButton icon="step-backward" />
        <PlayPauseButton />
        <PlayerButton icon="step-forward" />
        <Spacer />
      </div>
    );
  }
}

export default PlayerControls;
