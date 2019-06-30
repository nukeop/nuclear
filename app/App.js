import React from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import _ from 'lodash';
import Sound from 'react-hifi';
import { withTranslation } from 'react-i18next';

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

@withTranslation('app')
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.loadPlaylists();
  }
  
  togglePlayback () {
    if (this.props.player.playbackStatus === Sound.status.PAUSED) {
      this.scrobbleLastFmIfAble();
    }
    this.props.actions.togglePlayback(this.props.player.playbackStatus);
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
        <div className={styles.navbar_spacer}/>
        <HelpModal />
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
              {this.props.settings.compactMenuBar ? '0.5.0' : 'Version 0.5.0'}
            </div>
          </div>
          
          {this.renderMenuCategory('main', {
            'dashboard': 'dashboard',
            'downloads': 'download',
            'lyrics': 'microphone',
            'plugins': 'flask',
            'search': 'search',
            'settings': 'cogs',
            'equalizer': 'sliders'
          })}

          {this.renderMenuCategory('collection', {
            'favorites': 'star',
            'library': 'file-sound-o'
          })}

          {
            !_.isEmpty(this.props.playlists) &&
            <SidebarMenuCategoryHeader compact={this.props.settings.compactMenuBar} headerText={'playlists'}/>
          }
          <PlaylistsSubMenu
            playlists={this.props.playlists}
            compact={this.props.settings.compactMenuBar}
          />

          <Spacer />
          {this.renderSidebarFooter()}
        </SidebarMenu>
      </VerticalPanel>
    );
  }

  renderMenuCategory (headerText, iconObject) {
    return <React.Fragment>
      <SidebarMenuCategoryHeader compact={this.props.settings.compactMenuBar} headerText={headerText} /> 
      {Object.keys(iconObject).map(
        name => this.renderNavLink(name, iconObject[name]))
      }
    </React.Fragment>;
  }

  renderNavLink (name, icon) {
    return (
      <NavLink to={'/' + name} activeClassName={styles.active_nav_link}>
        <SidebarMenuItem>
          <FontAwesome name={icon} /> {!this.props.settings.compactMenuBar && name}
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
        />
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

  componentWillMount () {
    this.props.actions.readSettings();
    this.props.actions.lastFmReadSettings();
    this.props.actions.createSearchPlugins(PluginConfig.plugins);
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
