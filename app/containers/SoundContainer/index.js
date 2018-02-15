import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import * as ScrobblingActions from '../../actions/scrobbling';
import Sound from 'react-sound';

class SoundContainer extends React.Component {
  handlePlaying(update) {
    let seek = update.position;
    let progress = (update.position/update.duration) * 100;
    this.props.actions.updatePlaybackProgress(progress, seek);
    this.props.actions.updateStreamLoading(false);
  }

  handleLoading() {
    this.props.actions.updateStreamLoading(true);
  }

  handleLoaded() {
    this.props.actions.updateStreamLoading(false);
  }

  handleFinishedPlaying() {
    if(this.props.scrobbling.lastFmScrobblingEnabled && this.props.scrobbling.lastFmSessionKey) {
      let currentSong = this.props.queue.queueItems[this.props.queue.currentSong];
      this.props.actions.scrobbleAction(currentSong.artist, currentSong.name, this.props.scrobbling.lastFmSessionKey);
    }
    this.props.actions.nextSong();
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.queue.currentSong != nextProps.queue.currentSong ||
	this.props.player.playbackStatus != nextProps.player.playbackStatus ||
	this.props.player.seek != nextProps.player.seek
    );
  }

  render() {
    let {
      player,
      queue
    } = this.props;
    let streamUrl = '';
    if (queue.queueItems.length > 0) {
      let currentSong = queue.queueItems[queue.currentSong];
      if (currentSong.streams && currentSong.streams.length > 0) {
	streamUrl = currentSong.streams[0].stream;
      }
    }

    return (
      <Sound
	 url={streamUrl}
	 playStatus={player.playbackStatus}
	 onPlaying={this.handlePlaying.bind(this)}
	 onFinishedPlaying={this.handleFinishedPlaying.bind(this)}
	 onLoading={this.handleLoading.bind(this)}
	 onLoad={this.handleLoaded.bind(this)}
	 position={player.seek}
	 volume={player.volume}
	 />
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    player: state.player,
    scrobbling: state.scrobbling
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, Actions, PlayerActions, QueueActions, ScrobblingActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SoundContainer));
