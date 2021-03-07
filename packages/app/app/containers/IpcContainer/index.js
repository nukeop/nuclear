import { IpcEvents } from '@nuclear/core';
import React from 'react';
import logger from 'electron-timber';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ipcRenderer } from 'electron';

import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import * as SettingsActions from '../../actions/settings';
import * as PlaylistActions from '../../actions/playlists';
import * as EqualizerActions from '../../actions/equalizer';
import * as DownloadsActions from '../../actions/downloads';
import { localLibraryActions } from '../../actions/local';

class IpcContainer extends React.Component {
  componentDidMount() {
    const { actions } = this.props;

    ipcRenderer.send(IpcEvents.STARTED);

    ipcRenderer.on(IpcEvents.NEXT, () => actions.nextSong());
    ipcRenderer.on(IpcEvents.PREVIOUS, () => actions.previousSong());
    ipcRenderer.on(IpcEvents.PAUSE, () => actions.pausePlayback(true));
    ipcRenderer.on(IpcEvents.PLAYPAUSE, () => actions.togglePlayback(this.props.player.playbackStatus, true));
    ipcRenderer.on(IpcEvents.STOP, () => actions.pausePlayback(true));
    ipcRenderer.on(IpcEvents.PLAY, () => actions.startPlayback(true));
    ipcRenderer.on(IpcEvents.MUTE, () => {
      if (this.props.player.muted) {
        actions.unMute();
      } else {
        actions.mute();
      }
    });
    ipcRenderer.on(IpcEvents.VOLUME, (event, data) => actions.updateVolume(data, true));
    ipcRenderer.on(IpcEvents.SEEK, (event, data) => actions.updateSeek(data));

    ipcRenderer.on(IpcEvents.QUEUE_CLEAR, () => actions.clearQueue());
    ipcRenderer.on(IpcEvents.QUEUE, () => ipcRenderer.send(IpcEvents.QUEUE, this.props.queue.queueItems));
    ipcRenderer.on(IpcEvents.TRACK_SELECT, (event, index) => actions.selectSong(index));
  
    ipcRenderer.on(IpcEvents.PLAYLIST_CREATE, (event, name) => actions.addPlaylist(name, this.props.queue.queueItems));
    ipcRenderer.on(IpcEvents.PLAYLIST_REFRESH, () => actions.loadPlaylists());
    ipcRenderer.on(IpcEvents.PLAYLIST_ACTIVATE, (event, playlistName) => {
      const tracks = this.props.playlists.find(({ name }) => playlistName === name).tracks;

      actions.clearQueue();
      actions.addPlaylistTracksToQueue(tracks);
    });
    ipcRenderer.on(IpcEvents.PLAYLIST_ADD_QUEUE, (event, metas) => actions.addPlaylistTracksToQueue(metas));

    ipcRenderer.on(IpcEvents.EQUALIZER_UPDATE, (event, data) => actions.updateEqualizer(data));
    ipcRenderer.on(IpcEvents.EQUALIZER_SET, (event, data) => actions.setEqualizer(data));

    ipcRenderer.on(IpcEvents.LOCAL_FILES, (event, data) => actions.scanLocalFoldersSuccess(data));
    ipcRenderer.on(IpcEvents.LOCAL_FILES_PROGRESS, (event, { scanProgress, scanTotal }) => actions.scanLocalFoldersProgress(scanProgress, scanTotal));
    ipcRenderer.on(IpcEvents.LOCAL_FILES_ERROR, (event, err) => actions.scanLocalFoldersFailed(err));
    ipcRenderer.on(IpcEvents.PLAY_STARTUP_TRACK, (event, meta) => {
      this.props.actions.playTrack([], meta);
      this.props.history.push('/library');
    });


    ipcRenderer.on(IpcEvents.DOWNLOAD_STARTED, (event, data) => {
      this.props.actions.onDownloadStarted(data);
    });
    ipcRenderer.on(IpcEvents.DOWNLOAD_PROGRESS, (event, data) => {
      this.props.actions.onDownloadProgress(data.uuid, data.progress);
    });
    ipcRenderer.on(IpcEvents.DOWNLOAD_FINISHED, (event, data) => {
      this.props.actions.onDownloadFinished(data);
    });
    ipcRenderer.on(IpcEvents.DOWNLOAD_ERROR, (event, data) => {
      this.props.actions.onDownloadError(data.uuid);
      logger.error(data);
    });

    ipcRenderer.on(IpcEvents.SETTINGS, (event, data) => {
      const key = Object.keys(data).pop();
      const value = Object.values(data).pop();
    
      switch (typeof value) {
      case 'boolean':
        actions.setBooleanOption(key, value, true);
        break;
      case 'number':
        actions.setNumberOption(key, value, true);
        break;
      case 'string':
      default:
        actions.setStringOption(key, value, true);
        break;
      }
    });
    ipcRenderer.on(IpcEvents.PLAYING_STATUS, () => {
      const { shuffleQueue, loopAfterQueueEnd } = this.props.settings;

      try {
        const { artist, name, thumbnail } = this.props.queue.queueItems[this.props.queue.currentSong];

        ipcRenderer.send(IpcEvents.PLAYING_STATUS, { ...this.props.player, artist, name, thumbnail, loopAfterQueueEnd, shuffleQueue });
      } catch (err) {
        ipcRenderer.send(IpcEvents.PLAYING_STATUS, { ...this.props.player, loopAfterQueueEnd, shuffleQueue });
      }
    });

  }

  componentDidUpdate({ queue: prevQueue }) {
    const { queue } = this.props;
    const currentSong = queue.queueItems[queue.currentSong];
    const previousSong = prevQueue.queueItems[prevQueue.currentSong];

    if (
      (!previousSong && currentSong) ||
      (previousSong && currentSong && currentSong.name !== previousSong.name)
    ){
      ipcRenderer.send(IpcEvents.SONG_CHANGE, currentSong);
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    queue: state.queue,
    settings: state.settings,
    playlists: state.playlists.playlists,
    streamProviders: state.plugin.plugins.streamProviders
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...PlayerActions,
        ...QueueActions,
        ...SettingsActions,
        ...PlaylistActions,
        ...EqualizerActions,
        ...DownloadsActions,
        ...localLibraryActions
      },
      dispatch
    )
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IpcContainer));
