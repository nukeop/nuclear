import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as ToastActions from '../../actions/toasts';
import * as PlaylistActions from '../../actions/playlists';

import PlaylistView from '../../components/PlaylistView';

const PlaylistViewContainer = props => {
  return (
    <PlaylistView
      playlist={props.playlists.playlists[props.match.params.playlistId]}
      streamProviders={props.streamProviders}
      addTracks={props.actions.addPlaylistTracksToQueue}
      selectSong={props.actions.selectSong}
      startPlayback={props.actions.startPlayback}
      addToQueue={props.actions.addToQueue}
      clearQueue={props.actions.clearQueue}
      deletePlaylist={props.actions.deletePlaylist}
      updatePlaylist={props.actions.updatePlaylist}
      history={props.history}
    />
  );
};

function mapStateToProps (state) {
  return {
    playlists: state.playlists,
    streamProviders: state.plugin.plugins.streamProviders
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, QueueActions, PlayerActions, ToastActions, PlaylistActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaylistViewContainer));
