import React from 'react';
import { connect } from 'react-redux';

import styles from './styles.scss';

import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';

class PlayerControls extends React.Component {
  render() {
    const {queueItems} = this.props.queue;
    const disable = !queueItems || queueItems.length < 1;
    return (
      <div className={styles.player_controls_container}>
        <PlayerButton
          onClick={this.props.back}
          icon='step-backward'
          ariaLabel='Previous track button'
        />
        <PlayPauseButton
          onClick={this.props.togglePlay}
          playing={this.props.playing}
          loading={this.props.loading}
          disable={disable}
        />
        <PlayerButton
          onClick={this.props.forward}
          icon='step-forward'
          ariaLabel='Next track button'
        />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    queue: state.queue
  };
}

export default 
connect(
  mapStateToProps,
  null
)(PlayerControls);


