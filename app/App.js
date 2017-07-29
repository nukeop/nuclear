import React from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import * as Actions from './actions';

import './app.global.scss';
import styles from './styles.scss';

import { config as PluginConfig } from './plugins/config';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';
import Spacer from './components/Spacer';

import MainContentContainer from './containers/MainContentContainer';

import PlayQueueContainer from './containers/PlayQueueContainer';

import SearchBox from './components/SearchBox';
import SearchBoxContainer from './containers/SearchBoxContainer';

import Cover from './components/Cover';
import PlayerControls from './components/PlayerControls';
import PlayQueue from './components/PlayQueue';
import Seekbar from './components/Seekbar';
import SidebarMenu from './components/SidebarMenu';
import TrackInfo from './components/TrackInfo';
import WindowControls from './components/WindowControls';
import VolumeControls from './components/VolumeControls';

class App extends React.Component {
  componentWillMount() {
    this.props.actions.createSearchPlugins(PluginConfig.plugins);
  }

  render() {
    return (
      <div className={styles.app_container}>
        <Navbar className={styles.navbar}>
          <SearchBoxContainer />
          <Spacer />
          <Spacer />
          <WindowControls />
        </Navbar>
        <div className={styles.panel_container}>
          <VerticalPanel className={styles.left_panel}>
            <SidebarMenu>
              <div style={{textAlign: "center"}}>
                <img
                  width="150px"
                  src="./resources/media/nuclear/logo_full_light.png"
                />
                <div className={styles.version_string}>Version 0.4.0</div>
              </div>

              <Link to="/dashboard"><FontAwesome name="dashboard" /> Dashboard</Link>
              <a href="#"><FontAwesome name="download" /> Downloads</a>
              <a href="#"><FontAwesome name="music" /> Playlists</a>
              <a href="#"><FontAwesome name="cogs" /> Settings</a>
              <Link to="/"><FontAwesome name="search" /> Search results</Link>
            </SidebarMenu>
          </VerticalPanel>
          <VerticalPanel className={styles.center_panel}>
            <MainContentContainer />
          </VerticalPanel>
          <VerticalPanel className={styles.right_panel}>
            <PlayQueueContainer />
          </VerticalPanel>
        </div>
        <Footer className={styles.footer}>
          <Seekbar fill="30%"/>
          <div className={styles.footer_horizontal}>
            <div className={styles.track_info_wrapper}>
              <Cover cover="http://cdn.theobelisk.net/obelisk/wp-content/uploads/2012/01/vol4cover.jpg" />
              <TrackInfo track="Supernaut" artist="Black Sabbath" />
            </div>
            <Spacer />
            <PlayerControls />
            <Spacer />
            <VolumeControls fill="60%"/>
          </div>
        </Footer>

      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default withRouter(connect(state => {return {};},mapDispatchToProps)(App));
