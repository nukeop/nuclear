import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import Dashboard from '../../components/Dashboard';
import MainLayout from '../../components/MainLayout';
import SearchResults from '../../components/SearchResults';
import VerticalPanel from '../../components/VerticalPanel';

class MainContentContainer extends React.Component {

  render() {

    return(
      <Route render={({location, history, match}) => {
        return (
          <MainLayout>
            <RouteTransition
              pathname={location.pathname}
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
            >
              <Switch key={location.key} location={location}>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/" component={SearchResults} />
              </Switch>
            </RouteTransition>
          </MainLayout>
        );
      }
    }>

    </Route>
  );
}
}

function mapStateToProps(state) {
  return {
    unifiedSearchResults: state.search.unifiedSearchResults
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContentContainer));
