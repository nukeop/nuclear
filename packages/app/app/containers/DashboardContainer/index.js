import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SearchActions from '../../actions/search';
import * as DashboardActions from '../../actions/dashboard';
import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as ToastActions from '../../actions/toasts';

import Dashboard from '../../components/Dashboard';

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.readFavorites();
  }

  render() {
    const {
      actions,
      dashboard,
      settings,
      history,
      streamProviders,
      isConnected
    } = this.props;

    return (
      <Dashboard
        dashboardData={dashboard}
        history={history}
        settings={settings}
        actions={actions}
        streamProviders={streamProviders}
        isConnected={isConnected}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard,
    streamProviders: state.plugin.plugins.streamProviders,
    settings: state.settings,
    isConnected: state.connectivity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        SearchActions,
        DashboardActions,
        FavoritesActions,
        QueueActions,
        PlayerActions,
        ToastActions
      ),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
