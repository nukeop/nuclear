import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as QueueActions from '../../actions/queue';
import * as PluginsActions from '../../actions/plugins';
import * as PlaylistsActions from '../../actions/playlists';


import PlayQueue from '../../components/PlayQueue';


class PlayQueueContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <PlayQueue
        items={this.props.queue.queueItems}
        currentSong={this.props.queue.currentSong}
        musicSources={this.props.plugins.musicSources}
        pluginListSearch={this.props.actions.pluginListSearch}
	rerollTrack={this.props.actions.rerollTrack}
        selectSong={this.props.actions.selectSong}
        clearQueue={this.props.actions.clearQueue}
	removeFromQueue={this.props.actions.removeFromQueue}
        addPlaylist={this.props.actions.addPlaylist}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    plugins: state.plugin.plugins,
    playlists: state.playlists.playlists
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PluginsActions, QueueActions, PlaylistsActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayQueueContainer));
