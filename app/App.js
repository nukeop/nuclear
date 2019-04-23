import React from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import _ from 'lodash';
import Sound from 'react-sound-html5';

import * as Actions from './actions';
import * as PlayerActions from './actions/player';
import * as PlaylistsActions from './actions/playlists';
import * as PluginsActions from './actions/plugins';
import * as QueueActions from './actions/queue';
import * as SettingsActions from './actions/settings';
import * as ScrobblingActions from './actions/scrobbling';

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
import HelpModal from './components/HelpModal';
import Navbar from './components/Navbar';
import VerticalPanel from './components/VerticalPanel';
import Spacer from './components/Spacer';

import MainContentContainer from './containers/MainContentContainer';
import PlayQueueContainer from './containers/PlayQueueContainer';
import SearchBoxContainer from './containers/SearchBoxContainer';

import IpcContainer from './containers/IpcContainer';
import SoundContainer from './containers/SoundContainer';
import ToastContainer from './containers/ToastContainer';
import ShortcutsContainer from './containers/ShortcutsContainer';
import ErrorBoundary from './containers/ErrorBoundary';

import ui from 'nuclear-ui';
import NavButtons from './components/NavButtons';
import PlayerControls from './components/PlayerControls';
import Seekbar from './components/Seekbar';
import SidebarMenu from './components/SidebarMenu';
import SidebarMenuItem from './components/SidebarMenu/SidebarMenuItem';
import SidebarMenuCategoryHeader from './components/SidebarMenu/SidebarMenuCategoryHeader';
import TrackInfo from './components/TrackInfo';
import WindowControls from './components/WindowControls';
import VolumeControls from './components/VolumeControls';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.loadPlaylists();
  }
  
  togglePlayback () {
    if (
      this.props.player.playbackStatus === Sound.status.PAUSED &&
      this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey
    ) {
      let currentSong = this.props.queue.queueItems[
        this.props.queue.currentSong
      ];
      this.props.actions.updateNowPlayingAction(
        currentSong.artist,
        currentSong.name,
        this.props.scrobbling.lastFmSessionKey
      );
    }
    this.props.actions.togglePlayback(this.props.player.playbackStatus);
  }

  nextSong () {
    this.props.actions.nextSong();
    if (
      this.props.scrobbling.lastFmScrobblingEnabled &&
      this.props.scrobbling.lastFmSessionKey
    ) {
      let currentSong = this.props.queue.queueItems[
        this.props.queue.currentSong
      ];
      this.props.actions.updateNowPlayingAction(
        currentSong.artist,
        currentSong.name,
        this.props.scrobbling.lastFmSessionKey
      );
    }
  }

  renderNavBar () {
    return (
      <Navbar className={styles.navbar}>
        <NavButtons
          back={this.props.history.goBack}
          forward={this.props.history.goForward}
          historyLength={this.props.history.length}
          historyCurrentIndex={this.props.history.index}
        />
        <SearchBoxContainer />
        <Spacer style={{
          height: '100%',
          flex: '1 1 45%',
          '-webkit-app-region': 'drag'
        }}/>
        <HelpModal />
        {this.props.settings.framelessWindow && <WindowControls />}
      </Navbar>
    );
  }

  renderRightPanel (settings) {
    return (
      <VerticalPanel
        className={classnames(styles.right_panel, {
          [`${compact.compact_panel}`]: settings.compactQueueBar
        })}
      >
        <PlayQueueContainer compact={settings.compactQueueBar} />
      </VerticalPanel>
    );
  }
  
  renderSidebarMenu (settings, toggleOption) {
    return (
      <VerticalPanel
        className={classnames(styles.left_panel, {
          [`${compact.compact_panel}`]: settings.compactMenuBar
        })}
      >
        <SidebarMenu>
          <div className={styles.sidebar_brand}>
            <img
              width='50%'
              src={settings.compactMenuBar ? logoIcon : logoImg}
            />
            <div className={styles.version_string}>
              {settings.compactMenuBar ? '0.4.5' : 'Version 0.4.5'}
            </div>
          </div>
          <SidebarMenuCategoryHeader compact={ settings.compactMenuBar }>
            Main
          </SidebarMenuCategoryHeader>
          {this.renderNavLink('dashboard', 'dashboard', 'Dashboard', settings)}
          {this.renderNavLink('downloads', 'download', 'Downloads', settings)}
          {this.renderNavLink('lyrics', 'microphone', 'Lyrics', settings)}
          {this.renderNavLink('plugins', 'flask', 'Plugins', settings)}
          {this.renderNavLink('search', 'search', 'Search Results', settings)}
          {this.renderNavLink('settings', 'cogs', 'Settings', settings)}
          {this.renderNavLink('equalizer', 'sliders', 'Equalizer', settings)}

          <SidebarMenuCategoryHeader compact={ settings.compactMenuBar }>
            Collection
          </SidebarMenuCategoryHeader>
          {this.renderNavLink('favorites/tracks', 'star', 'Favorite tracks', settings)}

          {
            !_.isEmpty(this.props.playlists) &&
            <SidebarMenuCategoryHeader compact={ settings.compactMenuBar }>
            Playlists
            </SidebarMenuCategoryHeader>
          }
          <PlaylistsSubMenu
            playlists={this.props.playlists}
            compact={ settings.compactMenuBar }
          />
          
          <Spacer />
          {this.renderSidebarFooter(settings, toggleOption)}
        </SidebarMenu>
      </VerticalPanel>
    );
  }

  renderNavLink (name, icon, prettyName, settings) {
    return (
      <NavLink to={'/' + name} activeClassName={styles.active_nav_link}>
        <SidebarMenuItem>
          <FontAwesome name={icon} /> {!settings.compactMenuBar && prettyName}
        </SidebarMenuItem>
      </NavLink>
    );
  }

  renderSidebarFooter (settings, toggleOption) {
    return (
      <div className='sidebar_footer'>
        <a
          onClick={() =>
            toggleOption(
              _.find(settingsConst, ['name', 'compactMenuBar']),
              settings
            )
          }
          href='#'
        >
          <FontAwesome
            name={settings.compactMenuBar ? 'angle-right' : 'angle-left'}
          />
        </a>
      </div>
    );
  }

  renderFooter (settings) {
    return (
      <Footer className={styles.footer}>
        <Seekbar
          fill={this.props.player.playbackProgress + '%'}
          seek={this.props.actions.updateSeek}
          queue={this.props.queue}
        />
        <div className={styles.footer_horizontal}>
          <div className={styles.track_info_wrapper}>
            {this.renderCover()}
            {this.renderTrackInfo()}
          </div>
          {this.renderPlayerControls()}
          {this.renderVolumeControl(settings)}
        </div>
      </Footer>
    );
  }

  renderCover () {
    return (
      <ui.Cover
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
    const couldForward = queue.currentSong + 1 < queue.queueItems.length;
    const couldBack = queue.currentSong > 0;

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

  renderVolumeControl (settings) {
    return (
      <VolumeControls
        fill={this.props.player.volume}
        updateVolume={this.props.actions.updateVolume}
        muted={this.props.player.muted}
        toggleMute={this.props.actions.toggleMute}
        toggleOption={this.props.actions.toggleOption}
        settings={settings}
      />
    );
  }

  componentWillMount () {
    this.props.actions.readSettings();
    this.props.actions.lastFmReadSettings();
    this.props.actions.createSearchPlugins(PluginConfig.plugins);
  }

  render () {
    let { settings } = this.props;
    let { toggleOption } = this.props.actions;
    return (
      <React.Fragment>
        <ErrorBoundary>
          <div className={styles.app_container}>
            {this.renderNavBar()}
            <div className={styles.panel_container}>
              {this.renderSidebarMenu(settings, toggleOption)}
              <VerticalPanel className={styles.center_panel}>
                <MainContentContainer />
              </VerticalPanel>
              {this.renderRightPanel(settings)}
            </div>
            {this.renderFooter(settings)}
            <SoundContainer />
            <IpcContainer />
          </div>
        </ErrorBoundary>
        <ShortcutsContainer/>
        <ToastContainer/>
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
    settings: state.settings
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
        Actions
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
