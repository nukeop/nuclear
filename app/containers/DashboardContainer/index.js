import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
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
      musicSources
    } = this.props;

    return (
      <Dashboard
        dashboardData={dashboard}
        history={history}
        settings={settings}
        actions={actions}
        musicSources={musicSources}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard,
    musicSources: state.plugin.plugins.musicSources,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        Actions,
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
