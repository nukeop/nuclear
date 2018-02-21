import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ipcRenderer } from 'electron';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';

import { onNext, onPrevious, onPause, onPlayPause, onStop, onPlay, onSongChange} from '../../mpris';

class IpcContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ipcRenderer.send('started');
    ipcRenderer.on('next', event => onNext(event, this.props.actions));
    ipcRenderer.on('previous', event => onPrevious(event, this.props.actions));
    ipcRenderer.on('pause', event => onPause(event, this.props.actions));
    ipcRenderer.on('playpause', event => onPlayPause(event, this.props.actions, this.props.player));
    ipcRenderer.on('stop', event => onStop(event, this.props.actions));
    ipcRenderer.on('play', event => onPlay(event, this.props.actions));
  }

  componentWillReceiveProps(nextProps){
    if (this.props !== nextProps) {
      let currentSong = nextProps.queue.queueItems[nextProps.queue.currentSong];
      onSongChange(currentSong);
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    queue: state.queue
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PlayerActions, QueueActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IpcContainer));
