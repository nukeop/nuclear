import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as QueueActions from '../../actions/queue';
import * as PluginsActions from '../../actions/plugins';
import * as PlaylistsActions from '../../actions/playlists';
import * as SettingsActions from '../../actions/settings';
import * as ToastActions from '../../actions/toasts';

import PlayQueue from '../../components/PlayQueue';

const PlayQueueContainer = props => {
  return (
    <PlayQueue
      actions={props.actions}
      items={props.queue.queueItems}
      currentSong={props.queue.currentSong}
      plugins={props.plugins}
      settings={props.settings}
      compact={props.compact}
    />
  );
};

function mapStateToProps(state) {
  return {
    queue: state.queue,
    plugins: state.plugin,
    playlists: state.playlists.playlists,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PluginsActions, QueueActions, PlaylistsActions, SettingsActions, ToastActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayQueueContainer));
