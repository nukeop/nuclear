import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../actions';
import * as DashboardActions from '../actions/dashboard';
import * as DownloadsActions from '../actions/downloads';
import * as FavoritesActions from '../actions/favorites';
import * as PlayerActions from '../actions/player';
import * as QueueActions from '../actions/queue';
import * as ToastActions from '../actions/toasts';

const wrapComponent = (component, mapStateToProps) => {
  return withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(component)
  );
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign({}, 
        Actions, 
        DashboardActions,
        DownloadsActions,
        FavoritesActions,
        PlayerActions,
        QueueActions, 
        ToastActions,
      ),
      dispatch
    )
  };
}

export default wrapComponent;
