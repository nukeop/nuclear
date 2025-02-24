import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Mousetrap from 'mousetrap';
import Sound from 'react-hifi';
import _ from 'lodash';
import { compose } from 'recompose';
import { isMac } from '../../hooks/usePlatform';

import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import * as WindowActions from '../../actions/window';

const VOLUME_ITERATION = 1;
const SEEK_ITERATION = 10;
const COEF_ITERATION = 0.1;
const BASE_COEF = 1;

class Shortcuts extends React.Component {
  coef = BASE_COEF;
  timeout = null;

  getSeekIteration() {
    const { settings } = this.props;
    return _.defaultTo(settings.seekIteration, SEEK_ITERATION);
  }

  incrementCoef() {
    clearTimeout(this.timeout);
    this.coef = this.coef + COEF_ITERATION;
    this.timeout = setTimeout(() => {
      this.coef = BASE_COEF;
    }, 100);
  }

  handleSpaceBar = () => {
    const { queue, player, actions } = this.props;

    if (queue.queueItems.length > 0) {
      if (player.playbackStatus === Sound.status.PLAYING) {
        actions.pausePlayback(false);
      } else {
        actions.startPlayback(false);
      }
    }
    return false;
  }

  playCurrentTrack = () => {
    const { queue, player, actions } = this.props;

    if (
      queue.queueItems.length > 0 &&
      player.playbackStatus !== Sound.status.PLAYING
    ) {
      actions.startPlayback(false);
    }
    return false;
  }

  increaseVolume = () => {
    const { player, actions } = this.props;

    if (player.volume < 100) {
      actions.updateVolume(player.volume + VOLUME_ITERATION * this.coef, false);
      this.incrementCoef();
    }
    return false;
  }

  decreaseVolume = () => {
    const { player, actions } = this.props;

    if (player.volume > 0) {
      actions.updateVolume(player.volume - VOLUME_ITERATION * this.coef, false);
      this.incrementCoef();
    }
    return false;
  }

  increaseSeek = () => {
    const { player, actions } = this.props;

    if (player.playbackProgress < 100) {
      actions.updateSeek(player.seek + this.getSeekIteration() * this.coef);
      this.incrementCoef();
    }
    return false;
  }

  decreaseSeek = () => {
    const { player, actions } = this.props;

    if (player.playbackProgress > 0) {
      actions.updateSeek(player.seek - this.getSeekIteration() * this.coef);
      this.incrementCoef();
    }
    return false;
  }

  goToPreviousPage = () => {
    const { history } = this.props;
    if (history.index > 1) {
      history.goBack();
    }
  }

  goToNextPage = () => {
    const { history } = this.props;
    if (history.index < history.length - 1) {
      history.goForward();
    }
  }


  componentDidMount() {
    Mousetrap.addKeycodes({
      179: 'MediaPlayPause',
      177: 'MediaTrackPrevious',
      176: 'MediaTrackNext'
    });

    Mousetrap.bind('space', this.handleSpaceBar);
    Mousetrap.bind('enter', this.playcurrentTrack);
    Mousetrap.bind('up', this.increaseVolume);
    Mousetrap.bind('down', this.decreaseVolume);
    Mousetrap.bind('left', this.decreaseSeek);
    Mousetrap.bind('right', this.increaseSeek);
    Mousetrap.bind('alt+left', this.goToPreviousPage);
    Mousetrap.bind('alt+right', this.goToNextPage);
    Mousetrap.bind(['ctrl+right', 'command+right'], this.props.actions.nextSong);
    Mousetrap.bind(['ctrl+left', 'command+left'], this.props.actions.previousSong);
    Mousetrap.bind(['ctrl+top', 'command+top'], this.props.actions.unmute);
    Mousetrap.bind(['ctrl+down', 'command+down'], this.props.actions.mute);
    Mousetrap.bind('MediaPlayPause',  this.handleSpaceBar);
    Mousetrap.bind('MediaTrackPrevious',  this.props.actions.previousSong);
    Mousetrap.bind('MediaTrackNext',  this.props.actions.nextSong);
    if (isMac()){
      Mousetrap.bind('f7', this.props.actions.previousSong);
      Mousetrap.bind('f8', this.handleSpaceBar);
      Mousetrap.bind('f9', this.props.actions.nextSong);
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind([
      'space',
      'enter',
      'left',
      'right',
      'up',
      'down',
      'alt+left',
      'alt+right',
      'ctrl+right',
      'command+right',
      'ctrl+left',
      'command+left',
      'ctrl+top',
      'command+top',
      'ctrl+down',
      'command+down',
      'f7',
      'f8',
      'f9',
      'f12',
      'command+i',
      'MediaPlayPause',
      'MediaTrackPrevious',
      'MediaTrackNext'


    ]);
  }

  componentDidUpdate() {
    if (this.props.settings.devtools) {
      Mousetrap.bind(['f12', 'command+i'], this.props.actions.openDevtools);
    } else {
      Mousetrap.unbind(['f12', 'command+i']);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.settings.devtools !== this.props.settings.devtools;
  }

  render() {
    return null;
  }
}

function mapStateToProps({ player, queue, settings }) {
  return {
    player,
    queue,
    settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PlayerActions, QueueActions, WindowActions), dispatch)
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Shortcuts);
