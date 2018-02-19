import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as DashboardActions from '../../actions/dashboard';

import Dashboard from '../../components/Dashboard';

class DashboardContainer extends React.Component {
  render() {
    let {
      actions,
      dashboard,
      history
    } = this.props;
    return (
      <Dashboard
        albumInfoSearch={actions.albumInfoSearch}
        artistInfoSearchByName={actions.artistInfoSearchByName}
        loadBestNewAlbums={actions.loadBestNewAlbums}
        loadBestNewTracks={actions.loadBestNewTracks}
        loadNuclearNews={actions.loadNuclearNews}
        loadTopTags={actions.loadTopTags}
        dashboardData={dashboard}
        history={history}
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
    actions: bindActionCreators(Object.assign({}, Actions, DashboardActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
