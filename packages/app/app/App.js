import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import _ from 'lodash';
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

import './app.global.scss';
import styles from './styles.scss';
import compact from './compact.scss';

import logoImg from '../resources/media/logo_full_light.png';
import logoIcon from '../resources/media/512x512.png';

import settingsConst from './constants/settings';

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
import SidebarMenu from './components/SidebarMenu';
import SidebarMenuItem from './components/SidebarMenu/SidebarMenuItem';
import SidebarMenuCategoryHeader from './components/SidebarMenu/SidebarMenuCategoryHeader';
import WindowControls from './components/WindowControls';

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
    this.props.actions.loadPlaylists();
    this.props.actions.deserializePlugins();
    this.props.actions.githubContribInfo();

    this.updateConnectivityStatus(navigator.onLine);
    window.addEventListener('online', () => this.updateConnectivityStatus(true));
    window.addEventListener('offline', () => this.updateConnectivityStatus(false));
  }

  updateConnectivityStatus = (isConnected) => {
    this.props.actions.changeConnectivity(isConnected);
  }

  togglePlayback() {
    if (this.props.player.playbackStatus === Sound.status.PAUSED) {
      this.scrobbleLastFmIfAble();
    }
    this.props.actions.togglePlayback(this.props.player.playbackStatus);
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
    const currentSong = this.props.queue.queueItems[
      this.props.queue.currentSong
    ];
    this.props.actions.updateNowPlayingAction(
      currentSong.artist,
      currentSong.name,
      this.props.scrobbling.lastFmSessionKey
    );
  }

  canScrobbleLastFm() {
    return this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey;
  }

  renderNavBar() {
    return (
      <Navbar>
        <NavButtons />
        <SearchBoxContainer />
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
    );
  }

  renderRightPanel() {
    return (
      <VerticalPanel
        className={classnames(styles.right_panel, {
          [`${compact.compact_panel}`]: this.props.settings.compactQueueBar
        })}
      >
        <PlayQueueContainer compact={this.props.settings.compactQueueBar} />
      </VerticalPanel>
    );
  }

  renderSidebarMenu() {

    return (
      <VerticalPanel
        className={classnames(styles.left_panel, {
          [`${compact.compact_panel}`]: this.props.settings.compactMenuBar
        })}
      >
        <SidebarMenu>
          <div className={styles.sidebar_brand}>
            <img
              width='50%'
              src={this.props.settings.compactMenuBar ? logoIcon : logoImg}
            />
            <div className={styles.version_string}>
              {this.props.settings.compactMenuBar ? '0.6.16' : 'Version 0.6.16'}
            </div>
          </div>
          <div className={styles.sidebar_menus}>
            {
              this.renderMenuCategory('main', [
                { name: 'dashboard', path: 'dashboard', icon: 'dashboard' },
                { name: 'downloads', path: 'downloads', icon: 'download' },
                { name: 'lyrics', path: 'lyrics', icon: 'microphone' },
                { name: 'plugins', path: 'plugins', icon: 'flask' },
                { name: 'search', path: 'search', icon: 'search' },
                { name: 'settings', path: 'settings', icon: 'cog' },
                { name: 'equalizer', path: 'equalizer', icon: 'align right rotated' },
                { name: 'visualizer', path: 'visualizer', icon: 'tint' }
              ])
            }

            {
              this.renderMenuCategory('collection', [
                { name: 'favorite-albums', path: 'favorites/albums', icon: 'dot circle' },
                { name: 'favorite-tracks', path: 'favorites/tracks', icon: 'music' },
                { name: 'favorite-artists', path: 'favorites/artists', icon: 'user' },
                { name: 'library', path: 'library', icon: 'file audio outline' },
                { name: 'playlists', path: 'playlists', icon: 'list alternate outline' }
              ])
            }
          </div>

          {this.renderSidebarFooter()}
        </SidebarMenu>
      </VerticalPanel>
    );
  }

  renderMenuCategory(headerText, links) {
    return <React.Fragment>
      <SidebarMenuCategoryHeader
        compact={this.props.settings.compactMenuBar}
        headerText={this.props.t(headerText)}
      />
      {
        links.map(
          link => this.renderNavLink(link.name, link.path, link.icon)
        )
      }
    </React.Fragment>;
  }

  renderNavLink(name, path, icon) {
    return (
      <NavLink key={path} to={'/' + path} activeClassName={styles.active_nav_link}>
        <SidebarMenuItem
          name={this.props.t(name)}
          compact={this.props.settings.compactMenuBar}
        >
          <Icon name={icon} />{!this.props.settings.compactMenuBar && this.props.t(name)}
        </SidebarMenuItem>
      </NavLink>
    );
  }

  renderSidebarFooter() {
    return (
      <div className={styles.sidebar_footer}>
        <a
          onClick={() => {
            this.props.actions.toggleOption(
              _.find(settingsConst, ['name', 'compactMenuBar']),
              this.props.settings
            );
          }}
          href='#'
        >
          <FontAwesome
            name={this.props.settings.compactMenuBar ? 'angle-right' : 'angle-left'}
          />
        </a>
      </div>
    );
  }

  getCurrentSongParameter(parameter) {
    return this.props.queue.queueItems[this.props.queue.currentSong]
      ? this.props.queue.queueItems[this.props.queue.currentSong][parameter]
      : null;
  }

  render() {
    return (
      <>
        <ErrorBoundary>
          <div className={styles.app_container}>
            <MiniPlayerContainer />
            {this.renderNavBar()}
            <div className={styles.panel_container}>
              {this.renderSidebarMenu()}
              <VerticalPanel className={styles.center_panel}>
                <MainContentContainer />
              </VerticalPanel>
              {this.renderRightPanel()}
            </div>
            <PlayerBarContainer />
            <SoundContainer />
            <IpcContainer />
          </div>
        </ErrorBoundary>
        <ShortcutsContainer />
        <ToastContainer />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue,
    player: state.player,
    playlists: state.playlists.playlists,
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
        WindowActions
      ),
      dispatch
    )
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
