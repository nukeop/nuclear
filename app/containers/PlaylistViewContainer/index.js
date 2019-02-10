import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as ToastActions from '../../actions/toasts';

import PlaylistView from '../../components/PlaylistView';

const PlaylistViewContainer = props => {
  return (
    <PlaylistView
      playlist={this.props.playlists.playlists[this.props.match.params.playlistId]}
      musicSources={this.props.musicSources}
      addTracks={this.props.actions.addPlaylistTracksToQueue}
      selectSong={this.props.actions.selectSong}
      startPlayback={this.props.actions.startPlayback}
      notify={this.props.actions.notify}
    />
  );
};

function mapStateToProps(state) {
  return {
    playlists: state.playlists,
    musicSources: state.plugin.plugins.musicSources
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, QueueActions, PlayerActions, ToastActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaylistViewContainer));
