import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import classnames from 'classnames';
import Sound from 'react-hifi';
import { withTranslation } from 'react-i18next';
import { PluginConfig } from '@nuclear/core';
import * as SearchActions from './actions/search';
import * as PlayerActions from './actions/player';
import * as PlaylistsActions from './actions/playlists';
import * as PluginsActions from './actions/plugins';
import * as QueueActions from './actions/queue';
import * as SettingsActions from './actions/settings';
import * as ScrobblingActions from './actions/scrobbling';
import * as ImportFavActions from './actions/importfavs';
import * as ConnectivityActions from './actions/connectivity';
import * as GithubContribActions from './actions/githubContrib';
import * as WindowActions from './actions/window';
import * as DownloadActions from './actions/downloads';

import './app.global.scss';
import styles from './styles.scss';
import compact from './compact.scss';

import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';
import Spacer from './components/Spacer';

import HelpModalContainer from './containers/HelpModalContainer';
import MainContentContainer from './containers/MainContentContainer';
import PlayQueueContainer from './containers/PlayQueueContainer';
import SearchBoxContainer from './containers/SearchBoxContainer';
import PlayerBarContainer from './containers/PlayerBarContainer';
import MiniPlayerContainer from './containers/MiniPlayerContainer';

import IpcContainer from './containers/IpcContainer';
import SoundContainer from './containers/SoundContainer';
import ToastContainer from './containers/ToastContainer';
import ShortcutsContainer from './containers/ShortcutsContainer';
import ErrorBoundary from './containers/ErrorBoundary';

import NavButtons from './components/NavButtons';
import WindowControls from './components/WindowControls';
import CommandPaletteReminder from './components/CommandPaletteReminder';
import SidebarMenuContainer from './containers/SidebarMenuContainer';
import { CommandPaletteContainer } from './containers/CommandPaletteContainer';
import { hot } from 'react-hot-loader';
import SidebarBrand from './components/SidebarBrand';

@withTranslation('app')
class App extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.readSettings();
    this.props.actions.lastFmReadSettings();
    this.props.actions.FavImportInit();
    this.props.actions.createPlugins(PluginConfig.plugins);
    this.props.actions.deserializePlugins();
    this.props.actions.githubContribInfo();
    this.props.actions.resumeDownloads();

    this.updateConnectivityStatus(navigator.onLine);
    window.addEventListener('online', () => this.updateConnectivityStatus(true));
    window.addEventListener('offline', () => this.updateConnectivityStatus(false));
    window.addEventListener('auxclick', this.blockMiddleClick);
  }

  blockMiddleClick = (e) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
    if (e.button === 1) {
      e.preventDefault();
    }
  } 
  updateConnectivityStatus = (isConnected) => {
    this.props.actions.changeConnectivity(isConnected);
  }

  togglePlayback() {
    if (this.props.player.playbackStatus === Sound.status.PAUSED) {
      this.scrobbleLastFmIfAble();
    }
    this.props.actions.togglePlayback(this.props.player.playbackStatus, false);
  }

  nextSong() {
    this.props.actions.nextSong();
    this.scrobbleLastFmIfAble();
  }

  scrobbleLastFmIfAble() {
    if (this.canScrobbleLastFm()) {
      this.scrobbleLastFm();
    }
  }

  scrobbleLastFm() {
    const currentTrack = this.props.queue.queueItems[
      this.props.queue.currentTrack
    ];
    this.props.actions.updateNowPlayingAction(
      currentTrack.artist,
      currentTrack.name,
      this.props.scrobbling.lastFmSessionKey
    );
  }

  canScrobbleLastFm() {
    return this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey;
  }

  renderRightPanel() {
    return (
      <VerticalPanel
        className={classnames(styles.right_panel, {
          [`${compact.compact_panel}`]: this.props.settings.compactQueueBar
        })}
      >
        <PlayQueueContainer />
      </VerticalPanel>
    );
  }

  getCurrentTrackParameter(parameter) {
    return this.props.queue.queueItems[this.props.queue.currentTrack]
      ? this.props.queue.queueItems[this.props.queue.currentTrack][parameter]
      : null;
  }

  render() {
    return (
      <ErrorBoundary>
        <div className={styles.app_container}>
          <MiniPlayerContainer />
          <Navbar>
            <SidebarBrand />
            <NavButtons />
            <SearchBoxContainer />
            <CommandPaletteReminder />
            <Spacer className={styles.navbar_spacer} />
            <HelpModalContainer />
            {this.props.settings.framelessWindow && (
              <WindowControls
                onCloseClick={this.props.actions.closeWindow}
                onMaxClick={this.props.actions.maximizeWindow}
                onMinClick={this.props.actions.minimizeWindow}
              />
            )}
          </Navbar>
          <div className={styles.panel_container}>
            <SidebarMenuContainer />
            <VerticalPanel className={styles.center_panel}>
              <MainContentContainer />
            </VerticalPanel>
            {this.renderRightPanel()}
          </div>
          <PlayerBarContainer />
          <SoundContainer />
          <IpcContainer />
        </div>
        <CommandPaletteContainer />
        <ShortcutsContainer />
        <ToastContainer />
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    player: state.player,
    scrobbling: state.scrobbling,
    settings: state.settings,
    isConnected: state.connectivity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        ScrobblingActions,
        ImportFavActions,
        SettingsActions,
        QueueActions,
        PlayerActions,
        PlaylistsActions,
        PluginsActions,
        ConnectivityActions,
        SearchActions,
        GithubContribActions,
        WindowActions,
        DownloadActions
      ),
      dispatch
    )
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(hot(module)(App))
);
