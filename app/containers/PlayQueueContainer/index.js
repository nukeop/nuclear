import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as PluginsActions from '../../actions/plugins';
import * as PlaylistsActions from '../../actions/playlists';
import * as SettingsActions from '../../actions/settings';
import * as ToastActions from '../../actions/toasts';

import PlayQueue from '../../components/PlayQueue';

const PlayQueueContainer = props => {
  const {
    actions,
    queue,
    plugins,
    settings,
    playlists,
    compact
  } = props;
  
  return (
    <PlayQueue
      actions={ actions }
      items={ queue.queueItems }
      currentSong={ queue.currentSong }
      plugins={ plugins }
      settings={ settings }
      playlists={ playlists }
      compact={ compact }
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
    actions: bindActionCreators(Object.assign(
      {},
      FavoritesActions,
      PluginsActions,
      QueueActions,
      PlaylistsActions,
      SettingsActions,
      ToastActions
    ), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayQueueContainer));
