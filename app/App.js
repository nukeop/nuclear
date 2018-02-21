import React from 'react';
import FontAwesome from 'react-fontawesome';
import Sound from 'react-sound';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Link, withRouter } from 'react-router-dom';
import * as Actions from './actions';
import * as PlayerActions from './actions/player';
import * as PluginsActions from './actions/plugins';
import * as QueueActions from './actions/queue';
import * as SettingsActions from './actions/settings';
import * as ScrobblingActions from './actions/scrobbling';

import './app.global.scss';
import styles from './styles.scss';

import logoImg from '../resources/media/logo_full_light.png';
import artPlaceholder from '../resources/media/art_placeholder.png';

import { config as PluginConfig } from './plugins/config';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';
import Spacer from './components/Spacer';

import MainContentContainer from './containers/MainContentContainer';

import PlayQueueContainer from './containers/PlayQueueContainer';

import SearchBox from './components/SearchBox';
import SearchBoxContainer from './containers/SearchBoxContainer';

import IpcContainer from './containers/IpcContainer';
import SoundContainer from './containers/SoundContainer';

import Cover from './components/Cover';
import PlayerControls from './components/PlayerControls';
import PlayQueue from './components/PlayQueue';
import Seekbar from './components/Seekbar';
import SidebarMenu from './components/SidebarMenu';
import TrackInfo from './components/TrackInfo';
import WindowControls from './components/WindowControls';
import VolumeControls from './components/VolumeControls';

class App extends React.Component {
  togglePlayback() {
    if(this.props.player.playbackStatus===Sound.status.PAUSED &&
      this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey) {
        let currentSong = this.props.queue.queueItems[this.props.queue.currentSong];
        this.props.actions.updateNowPlayingAction(currentSong.artist, currentSong.name, this.props.scrobbling.lastFmSessionKey);
      }
      this.props.actions.togglePlayback(this.props.player.playbackStatus);
    }

  nextSong() {
    this.props.actions.nextSong();
    if( this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey) {
        let currentSong = this.props.queue.queueItems[this.props.queue.currentSong];
        this.props.actions.updateNowPlayingAction(currentSong.artist, currentSong.name, this.props.scrobbling.lastFmSessionKey);
      }
    }

  componentWillMount() {
    this.props.actions.readSettings();
    this.props.actions.lastFmReadSettings();
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
                  src={logoImg}
                />
                <div className={styles.version_string}>Version 0.4.2</div>
              </div>

              <NavLink to="/dashboard" activeClassName={styles.active_nav_link}><FontAwesome name="dashboard" /> Dashboard</NavLink>
              <a href="#"><FontAwesome name="download" /> Downloads</a>
              <NavLink to="/playlists" activeClassName={styles.active_nav_link}><FontAwesome name="music" /> Playlists</NavLink>
              <NavLink to='/settings' activeClassName={styles.active_nav_link}><FontAwesome name="cogs" /> Settings</NavLink>
              <NavLink to="/search" activeClassName={styles.active_nav_link}><FontAwesome name="search" /> Search results</NavLink>
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
          <Seekbar
            fill={this.props.player.playbackProgress + '%'}
            seek={this.props.actions.updateSeek}
            queue={this.props.queue}
          />
          <div className={styles.footer_horizontal}>
            <div className={styles.track_info_wrapper}>
              <Cover cover={this.props.queue.queueItems[this.props.queue.currentSong] ? this.props.queue.queueItems[this.props.queue.currentSong].thumbnail : artPlaceholder} />
              <TrackInfo
                track={this.props.queue.queueItems[this.props.queue.currentSong] ? this.props.queue.queueItems[this.props.queue.currentSong].name : null}
                artist={this.props.queue.queueItems[this.props.queue.currentSong] ? this.props.queue.queueItems[this.props.queue.currentSong].artist : null}
              />
            </div>
            <PlayerControls
              togglePlay={this.togglePlayback.bind(this)}
              playing={this.props.player.playbackStatus == Sound.status.PLAYING}
              loading={this.props.player.playbackStreamLoading}
              forward={this.nextSong.bind(this)}
              back={this.props.actions.previousSong}
            />
            <VolumeControls
              fill={this.props.player.volume + '%'}
              updateVolume={this.props.actions.updateVolume}
            />
          </div>
        </Footer>
        <SoundContainer />
        <IpcContainer />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    player: state.player,
    scrobbling: state.scrobbling
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({},
      ScrobblingActions,
      SettingsActions,
      QueueActions,
      PlayerActions,
      PluginsActions,
      Actions
    ), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
