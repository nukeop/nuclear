import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import Sound from 'react-sound';

class SoundContainer extends React.Component {
  handlePlaying(update) {
    let progress = (update.position/update.duration) * 100;
    this.props.actions.updatePlaybackProgress(progress);
  }

  handleFinishedPlaying() {
    this.props.actions.nextSong();
  }

  render() {
    return (
      <Sound
        url={this.props.queue.queueItems.length > 0 ? this.props.queue.queueItems[this.props.queue.currentSong].streams[0].stream : null}
        playStatus={this.props.player.playbackStatus}
        onPlaying={this.handlePlaying.bind(this)}
        onFinishedPlaying={this.handleFinishedPlaying.bind(this)}
        playFromPosition={this.props.player.seek}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    player: state.player
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, Actions, PlayerActions, QueueActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SoundContainer));
