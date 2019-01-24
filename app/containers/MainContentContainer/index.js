import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import MainLayout from '../../components/MainLayout';

import AlbumViewContainer from '../AlbumViewContainer';
import ArtistViewContainer from '../ArtistViewContainer';
import DashboardContainer from '../DashboardContainer';
import PlaylistsContainer from '../PlaylistsContainer';
import PlaylistViewContainer from '../PlaylistViewContainer';
import PluginsContainer from '../PluginsContainer';
import SearchResultsContainer from '../SearchResultsContainer';
import SettingsContainer from '../SettingsContainer';
import TagViewContainer from '../TagViewContainer';

import Downloads from '../../components/Downloads';

class MainContentContainer extends React.Component {
  componentDidMount() {
    if (this.props.history
    && this.props.location
    && this.props.location.pathname === '/') {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    return (
      <Route render={({location, history, match}) => {
        return (
          <MainLayout>
            <Switch key={location.key} location={location}>
              <Route path='/album/:albumId' component={AlbumViewContainer} />
              <Route path='/artist/:artistId' component={ArtistViewContainer} />
              <Route path='/dashboard' component={DashboardContainer} />
              <Route path='/downloads' component={Downloads} />
              <Route path='/playlists' component={PlaylistsContainer} />
              <Route path='/playlist/:playlistId' component={PlaylistViewContainer} />
              <Route path='/plugins' component={PluginsContainer} />
              <Route path='/settings' component={SettingsContainer} />
              <Route path='/tag/:tagName' component={TagViewContainer}/>
              <Route path='/search' component={SearchResultsContainer} />
            </Switch>
          </MainLayout>
        );
      }
      } />
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContentContainer));
