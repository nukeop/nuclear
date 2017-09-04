import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ipcRenderer } from 'electron';
import * as PlayerActions from '../../actions/player';

import { onNext, onPrevious, onPause, onPlayPause, onStop, onPlay, onSongChange} from '../../mpris';

class IpcContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ipcRenderer.send('started');
    ipcRenderer.on('next', onNext);
    ipcRenderer.on('previous', onPrevious);
    ipcRenderer.on('pause', onPause);
    ipcRenderer.on('playpause', onPlayPause);
    ipcRenderer.on('stop', onStop);
    ipcRenderer.on('play', onPlay);
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PlayerActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IpcContainer));
