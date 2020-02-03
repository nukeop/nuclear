import React from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import _ from 'lodash';
import Sound from 'react-hifi';
import { withTranslation } from 'react-i18next';
import { Cover, formatDuration } from '@nuclear/ui';

import * as Actions from './actions';
import * as PlayerActions from './actions/player';
import * as PlaylistsActions from './actions/playlists';
import * as PluginsActions from './actions/plugins';
import * as QueueActions from './actions/queue';
import * as SettingsActions from './actions/settings';
import * as ScrobblingActions from './actions/scrobbling';
import * as ConnectivityActions from './actions/connectivity';
import * as GithubContribActions from './actions/githubContrib';
import { sendPaused } from './mpris';

import './app.global.scss';
import styles from './styles.scss';
import compact from './compact.scss';

import logoImg from '../resources/media/logo_full_light.png';
import logoIcon from '../resources/media/512x512.png';
import artPlaceholder from '../resources/media/art_placeholder.png';

import { config as PluginConfig } from './plugins/config';
import settingsConst from './constants/settings';

import PlaylistsSubMenu from './components/PlaylistsSubMenu';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';
import Spacer from './components/Spacer';

import HelpModalContainer from './containers/HelpModalContainer';
import MainContentContainer from './containers/MainContentContainer';
import PlayQueueContainer from './containers/PlayQueueContainer';
import SearchBoxContainer from './containers/SearchBoxContainer';

import IpcContainer from './containers/IpcContainer';
import SoundContainer from './containers/SoundContainer';
import ToastContainer from './containers/ToastContainer';
import ShortcutsContainer from './containers/ShortcutsContainer';
import ErrorBoundary from './containers/ErrorBoundary';

import NavButtons from './components/NavButtons';
import PlayerControls from './components/PlayerControls';
import Seekbar from './components/Seekbar';
import SidebarMenu from './components/SidebarMenu';
import SidebarMenuItem from './components/SidebarMenu/SidebarMenuItem';
import SidebarMenuCategoryHeader from './components/SidebarMenu/SidebarMenuCategoryHeader';
import TrackDuration from './components/TrackDuration';
import TrackInfo from './components/TrackInfo';
import WindowControls from './components/WindowControls';
import VolumeControls from './components/VolumeControls';

import * as mpris from './mpris';

@withTranslation('app')
class App extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.readSettings();
    this.props.actions.lastFmReadSettings();
    this.props.actions.createPlugins(PluginConfig.plugins);
    this.props.actions.loadPlaylists();
    this.props.actions.deserializePlugins();
    this.props.actions.githubContribInfo();

    this.updateConnectivityStatus(navigator.onLine);
    window.addEventListener('online',  () => this.updateConnectivityStatus(true));
    window.addEventListener('offline',  () => this.updateConnectivityStatus(false));
  }

  updateConnectivityStatus = (isConnected) => {
    mpris.sendConnectivity(isConnected);
    this.props.actions.changeConnectivity(isConnected);
  }

  togglePlayback () {
    if (this.props.player.playbackStatus === Sound.status.PAUSED) {
      this.scrobbleLastFmIfAble();
    }
    this.props.actions.togglePlayback(this.props.player.playbackStatus, sendPaused);
  }

  nextSong () {
    this.props.actions.nextSong();
    this.scrobbleLastFmIfAble();
  }

  scrobbleLastFmIfAble () {
    if (this.canScrobbleLastFm()) {
      this.scrobbleLastFm();
    }
  }

  scrobbleLastFm () {
    let currentSong = this.props.queue.queueItems[
      this.props.queue.currentSong
    ];
    this.props.actions.updateNowPlayingAction(
      currentSong.artist,
      currentSong.name,
      this.props.scrobbling.lastFmSessionKey
    );
  }

  canScrobbleLastFm () {
    return this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey;
  }

  renderNavBar () {
    return (
      <Navbar>
        <NavButtons/>
        <SearchBoxContainer />
        <Spacer className={styles.navbar_spacer}/>
        <HelpModalContainer />
        {this.props.settings.framelessWindow && <WindowControls />}
      </Navbar>
    );
  }

  renderRightPanel () {
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

  renderSidebarMenu () {
    
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
              {this.props.settings.compactMenuBar ? '0.6.3' : 'Version 0.6.3'}
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
                { name: 'settings', path: 'settings', icon: 'cogs' },
                { name: 'equalizer', path: 'equalizer', icon: 'sliders' }
              ])
            }

            {
              this.renderMenuCategory('collection', [
                { name: 'favorite-albums', path: 'favorites/albums', icon: 'star' },
                { name: 'favorite-tracks', path: 'favorites/tracks', icon: 'star' },
                { name: 'library', path: 'library', icon: 'file-sound-o' }
              ])
            }

            {
              !_.isEmpty(this.props.playlists) &&
              <SidebarMenuCategoryHeader compact={this.props.settings.compactMenuBar} headerText={'playlists'}/>
            }
            <PlaylistsSubMenu
              playlists={this.props.playlists}
              compact={this.props.settings.compactMenuBar}
            />
          </div>

          <Spacer />
          {this.renderSidebarFooter()}
        </SidebarMenu>
      </VerticalPanel>
    );
  }

  renderMenuCategory (headerText, links) {
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

  renderNavLink (name, path, icon) {
    return (
      <NavLink key={path} to={'/' + path} activeClassName={styles.active_nav_link}>
        <SidebarMenuItem>
          <FontAwesome name={icon} /> {!this.props.settings.compactMenuBar && this.props.t(name)}
        </SidebarMenuItem>
      </NavLink>
    );
  }

  renderSidebarFooter () {
    return (
      <div className='sidebar_footer'>
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

  renderFooter () {
    return (
      <Footer className={styles.footer}>
        <Seekbar
          fill={this.props.player.playbackProgress + '%'}
          seek={this.props.actions.updateSeek}
          queue={this.props.queue}
        >
          {
            this.props.settings.trackDuration &&
            !_.isNil(this.props.queue.queueItems[this.props.queue.currentSong]) &&
            this.renderTrackDuration()
          }
        </Seekbar>
        <div className={styles.footer_horizontal}>
          <div className={styles.track_info_wrapper}>
            {this.renderCover()}
            {this.renderTrackInfo()}
          </div>
          {this.renderPlayerControls()}
          {this.renderVolumeControl()}
        </div>
      </Footer>
    );
  }

  renderTrackDuration() {
    const currentTrackStream = _.head(
      _.get(
        this.props.queue.queueItems[this.props.queue.currentSong],
        'streams'
      )
    );

    const currentTrackDuration = _.get(
      currentTrackStream,
      'duration'
    );

    const timeToEnd = currentTrackDuration - this.props.player.seek;

    return (
      <TrackDuration
        timePlayed={formatDuration(this.props.player.seek)}
        timeToEnd={
          (!_.isNil(currentTrackDuration) && ('-' + formatDuration(timeToEnd)))
          || '0'
        }
      />
    );
  }

  renderCover () {
    return (
      <Cover
        cover={
          this.props.queue.queueItems[this.props.queue.currentSong]
            ? this.props.queue.queueItems[this.props.queue.currentSong]
              .thumbnail
            : artPlaceholder
        }
      />
    );
  }

  getCurrentSongParameter (parameter) {
    return this.props.queue.queueItems[this.props.queue.currentSong]
      ? this.props.queue.queueItems[this.props.queue.currentSong][parameter]
      : null;
  }

  renderTrackInfo () {
    return (
      <TrackInfo
        track={this.getCurrentSongParameter('name')}
        artist={this.getCurrentSongParameter('artist')}
        artistInfoSearchByName={this.props.actions.artistInfoSearchByName}
        history={this.props.history}
      />
    );
  }

  renderPlayerControls () {
    const { player, queue } = this.props;
    const couldPlay = queue.queueItems.length > 0;
    const couldForward = couldPlay && queue.currentSong + 1 < queue.queueItems.length;
    const couldBack = couldPlay && queue.currentSong > 0;

    return (
      <PlayerControls
        togglePlay={couldPlay ? this.togglePlayback.bind(this) : undefined}
        playing={player.playbackStatus === Sound.status.PLAYING}
        loading={player.playbackStreamLoading}
        forward={couldForward ? this.nextSong.bind(this) : undefined}
        back={couldBack ? this.props.actions.previousSong : undefined}
      />
    );
  }

  renderVolumeControl () {
    return (
      <VolumeControls
        fill={this.props.player.volume}
        updateVolume={this.props.actions.updateVolume}
        muted={this.props.player.muted}
        toggleMute={this.props.actions.toggleMute}
        toggleOption={this.props.actions.toggleOption}
        settings={this.props.settings}
      />
    );
  }

  render () {
    return (
      <React.Fragment>
        <ErrorBoundary>
          <div className={styles.app_container}>
            {this.renderNavBar()}
            <div className={styles.panel_container}>
              {this.renderSidebarMenu()}
              <VerticalPanel className={styles.center_panel}>
                <MainContentContainer />
              </VerticalPanel>
              {this.renderRightPanel()}
            </div>
            {this.renderFooter()}
            <SoundContainer />
            <IpcContainer />
          </div>
        </ErrorBoundary>
        <ShortcutsContainer />
        <ToastContainer />
      </React.Fragment>
    );
  }
}

function mapStateToProps (state) {
  return {
    queue: state.queue,
    player: state.player,
    playlists: state.playlists.playlists,
    scrobbling: state.scrobbling,
    settings: state.settings,
    isConnected: state.connectivity
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {},
        ScrobblingActions,
        SettingsActions,
        QueueActions,
        PlayerActions,
        PlaylistsActions,
        PluginsActions,
        ConnectivityActions,
        Actions,
        GithubContribActions
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
