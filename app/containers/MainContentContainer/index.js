import React from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { RouteTransition } from 'react-router-transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import Dashboard from '../../components/Dashboard';
import MainLayout from '../../components/MainLayout';

import AlbumViewContainer from '../AlbumViewContainer';
import ArtistViewContainer from '../ArtistViewContainer';
import SearchResultsContainer from '../SearchResultsContainer';


import styles from './styles.scss';

class MainContentContainer extends React.Component {

  render() {

    return(
      <Route render={({location, history, match}) => {
        return (
          <MainLayout>
            <RouteTransition
              pathname={location.key}
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
              className={styles.transition}
            >
              <Switch key={location.key} location={location}>
                <Route path="/album/:albumId" component={AlbumViewContainer} />
                <Route path="/artist/:artistId" component={ArtistViewContainer} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/" component={SearchResultsContainer} />
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContentContainer));
