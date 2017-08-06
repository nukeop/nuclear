import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as QueueActions from '../../actions/queue';
import * as PluginsActions from '../../actions/plugins';


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
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    plugins: state.plugin.plugins
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, PluginsActions, QueueActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayQueueContainer));
