import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sound from 'react-sound';
import * as Mousetrap from 'mousetrap';

import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';

const VOLUME_ITERATION = 5;
const SEEK_ITERATION = 200;

class Shortcuts extends React.Component {
  handleSpaceBar() {
    const { queue, player, actions } = this.props;

    if (queue.queueItems.length > 0) {
      if (player.playbackStatus === Sound.status.PLAYING) {
        actions.pausePlayback();
      } else {
        actions.startPlayback();
      }
    }
    return false;
  }

  playCurrentSong() {
    const { queue, player, actions } = this.props;

    if (
      queue.queueItems.length > 0 && 
      player.playbackStatus !== Sound.status.PLAYING
    ) {
      actions.startPlayback();
    }
    return false;
  }

  increaseVolume() {
    const { player, actions } = this.props;

    if (player.volume < 100) {
      actions.updateVolume(player.volume + VOLUME_ITERATION);
    }
    return false;
  }

  decreaseVolume() {
    const { player, actions } = this.props;

    if (player.volume > 0) {
      actions.updateVolume(player.volume - VOLUME_ITERATION);
    }
    return false;
  }

  increaseSeek() {
    const { player, actions } = this.props;

    if (player.playbackProgress < 100) {
      actions.updateSeek(player.seek + SEEK_ITERATION);
    }
    return false;
  }

  decreaseSeek() {
    const { player, actions} = this.props;

    if (player.playbackProgress > 0) {
      actions.updateSeek(player.seek - SEEK_ITERATION);
    }
    return false;
  }

  constructor(props) {
    super(props);
    this.handleSpaceBar = this.handleSpaceBar.bind(this);
    this.increaseVolume = this.increaseVolume.bind(this);
    this.decreaseVolume = this.decreaseVolume.bind(this);
    this.playCurrentSong = this.playCurrentSong.bind(this);
    this.increaseSeek = this.increaseSeek.bind(this);
    this.decreaseSeek = this.decreaseSeek.bind(this);
  }

  componentDidMount() {
    Mousetrap.bind('space', this.handleSpaceBar);
    Mousetrap.bind('enter', this.playCurrentSong);
    Mousetrap.bind('up', this.increaseVolume);
    Mousetrap.bind('down', this.decreaseVolume);
    Mousetrap.bind('left', this.decreaseSeek);
    Mousetrap.bind('right', this.increaseSeek);
    Mousetrap.bind(['ctrl+right', 'command+right'], this.props.actions.nextSong);
    Mousetrap.bind(['ctrl+left', 'command+left'], this.props.actions.previousSong);
    Mousetrap.bind(['ctrl+top', 'command+top'], this.props.actions.unmute);
    Mousetrap.bind(['ctrl+down', 'command+down'], this.props.actions.mute);
  }

  componentWillUnmount() {
    Mousetrap.unbind([
      'space',
      'left',
      'right',
      'up',
      'down',
      'right',
      'left',
      'ctrl+right',
      'command+right',
      'ctrl+left',
      'command+left',
      'ctrl+top',
      'command+top',
      'ctrl+down',
      'command+down'
    ]);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

function mapStateToProps({ player, queue }) {
  return {
    player,
    queue
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PlayerActions, QueueActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Shortcuts);
