import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { useLocalPlaylists } from '../PlaylistsContainer/hooks';
import * as DownloadsActions from '../../actions/downloads';
import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as PluginsActions from '../../actions/plugins';
import * as PlaylistsActions from '../../actions/playlists';
import * as SettingsActions from '../../actions/settings';
import * as ToastActions from '../../actions/toasts';
import * as PlayerActions from '../../actions/player';

import PlayQueue from '../../components/PlayQueue';

export type PlayQueueActions = typeof DownloadsActions &
typeof FavoritesActions &
 typeof PlaylistsActions &
 typeof PluginsActions &
  typeof QueueActions &
   typeof SettingsActions &
    typeof ToastActions &
     typeof PlayerActions;

const PlayQueueContainer = props => {
  const {
    actions,
    queue,
    plugins,
    settings
  } = props;
  
  const { localPlaylists: playlists } = useLocalPlaylists();

  return (
    <PlayQueue
      actions={actions}
      queue={queue}
      plugins={plugins}
      settings={settings}
      playlists={playlists.data}
    />
  );
};

function mapStateToProps(state) {
  return {
    queue: state.queue,
    plugins: state.plugin,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign(
      {},
      DownloadsActions,
      FavoritesActions,
      PlaylistsActions,
      PluginsActions,
      QueueActions,
      SettingsActions,
      ToastActions,
      PlayerActions
    ), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayQueueContainer));
