import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as DashboardActions from '../../actions/dashboard';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';


import Dashboard from '../../components/Dashboard';

class DashboardContainer extends React.Component {
  render () {
    let { actions, dashboard, history } = this.props;

    return (
      <Dashboard
        albumInfoSearch={actions.albumInfoSearch}
        albumInfoSearchByName={actions.albumInfoSearchByName}
        artistInfoSearchByName={actions.artistInfoSearchByName}
        loadBestNewAlbums={actions.loadBestNewAlbums}
        loadBestNewTracks={actions.loadBestNewTracks}
        loadNuclearNews={actions.loadNuclearNews}
        loadTopTags={actions.loadTopTags}
        loadTopTracks={actions.loadTopTracks}
        dashboardData={dashboard}
        history={history}
        addToQueue={actions.addToQueue}
        musicSources={this.props.musicSources}
        startPlayback={actions.startPlayback}
        clearQueue={actions.clearQueue}
        selectSong={actions.selectSong}
      />
    );
  }
}

function mapStateToProps (state) {
  return {
    dashboard: state.dashboard,
    musicSources: state.plugin.plugins.musicSources
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign({}, Actions, DashboardActions, QueueActions, PlayerActions),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
