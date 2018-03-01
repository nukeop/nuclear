import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as QueueActions from '../../actions/queue';
import * as PluginsActions from '../../actions/plugins';
import * as PlaylistsActions from '../../actions/playlists';
import * as SettingsActions from '../../actions/settings';

import PlayQueue from '../../components/PlayQueue';

class PlayQueueContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <PlayQueue
        actions={this.props.actions}
        items={this.props.queue.queueItems}
        currentSong={this.props.queue.currentSong}
        musicSources={this.props.plugins.musicSources}
        settings={this.props.settings}
        compact={this.props.compact}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    plugins: state.plugin.plugins,
    playlists: state.playlists.playlists,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PluginsActions, QueueActions, PlaylistsActions, SettingsActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayQueueContainer));
