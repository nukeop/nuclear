import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from '../../actions/dashboard';

import Dashboard from '../../components/Dashboard';

class DashboardContainer extends React.Component {
  render() {
    return (
      <Dashboard
	 loadBestNewAlbums={this.props.actions.loadBestNewAlbums}
	 loadBestNewTracks={this.props.actions.loadBestNewTracks}
	 loadNuclearNews={this.props.actions.loadNuclearNews}
	 loadTopTags={this.props.actions.loadTopTags}
	 dashboardData={this.props.dashboard}
	 />
    );
  }
}

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DashboardActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
