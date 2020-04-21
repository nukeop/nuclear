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
import * as LocalFileActions from '../../actions/local';

class IpcContainer extends React.Component {
  componentDidMount() {
    const { actions } = this.props;

    ipcRenderer.send('started');

    ipcRenderer.on('next', () => actions.nextSong());
    ipcRenderer.on('previous', () => actions.previousSong());
    ipcRenderer.on('pause', () => actions.pausePlayback());
    ipcRenderer.on('playpause', () => actions.togglePlayback(this.props.player.playbackStatus));
    ipcRenderer.on('stop', () => actions.pausePlayback());
    ipcRenderer.on('play', () => actions.startPlayback());
  
    ipcRenderer.on('mute', () => {
      if (this.props.player.muted) {
        actions.unMute();
      } else {
        actions.mute();
      }
    });
    ipcRenderer.on('volume', (event, data) => actions.updateVolume(data));
    ipcRenderer.on('seek', (event, data) => actions.updateSeek(data));

    ipcRenderer.on('empty-queue', () => actions.clearQueue());
    ipcRenderer.on('queue', () => ipcRenderer.send('queue', this.props.queue.queueItems));
    ipcRenderer.on('select-track', (event, index) => actions.selectSong(index));
    ipcRenderer.on('create-playlist', (event, name) => actions.addPlaylist(name, this.props.queue.queueItems));
    ipcRenderer.on('refresh-playlists', () => actions.loadPlaylists());
    ipcRenderer.on('activate-playlist', (event, playlistName) => {
      const tracks = this.props.playlists.find(({ name }) => playlistName === name).tracks;

      actions.clearQueue();
      actions.addPlaylistTracksToQueue(this.props.streamProviders, tracks);
    });
    ipcRenderer.on('update-equalizer', (event, data) => actions.updateEqualizer(data));
    ipcRenderer.on('set-equalizer', (event, data) => actions.setEqualizer(data));
    ipcRenderer.on('local-files-progress', (event, { scanProgress, scanTotal }) => actions.scanLocalFoldersProgress(scanProgress, scanTotal));
    ipcRenderer.on('local-files', (event, data) => actions.scanLocalFoldersSuccess(data));
    ipcRenderer.on('local-files-error', (event, err) => actions.scanLocalFoldersFailed(err));
    ipcRenderer.on('play-startup-track', (event, meta) => {
      this.props.actions.playTrack(
        this.props.streamProviders.filter(({ sourceName }) => sourceName === 'Local'),
        meta
      );
      this.props.history.push('/library');
    });

    ipcRenderer.on('queue-add', (event, metas) => {
      this.props.actions.addPlaylistTracksToQueue(
        this.props.streamProviders.filter(({ sourceName }) => sourceName === 'Local'),
        metas
      );
    });

    ipcRenderer.on('download-started', (event, data) => {
      this.props.actions.onDownloadStarted(data);
    });
    ipcRenderer.on('download-progress', (event, data) => {
      this.props.actions.onDownloadProgress(data.uuid, data.progress);
    });
    ipcRenderer.on('download-finished', (event, data) => {
      this.props.actions.onDownloadFinished(data);
    });
    ipcRenderer.on('download-error', (event, data) => {
      this.props.actions.onDownloadError(data.uuid);
      logger.error(data);
    });

    ipcRenderer.on('settings', (event, data) => {
      const key = Object.keys(data).pop();
      const value = Object.values(data).pop();
    
      switch (typeof value) {
      case 'boolean':
        actions.setBooleanOption(key, value);
        break;
      case 'number':
        actions.setNumberOption(key, value);
        break;
      case 'string':
      default:
        actions.setStringOption(key, value);
        break;
      }
    });
    ipcRenderer.on('playing-status', () => {
      const { shuffleQueue, loopAfterQueueEnd } = this.props.settings;

      try {
        const { artist, name, thumbnail } = this.props.queue.queueItems[this.props.queue.currentSong];

        ipcRenderer.send('playing-status', { ...this.props.player, artist, name, thumbnail, loopAfterQueueEnd, shuffleQueue });
      } catch (err) {
        ipcRenderer.send('playing-status', { ...this.props.player, loopAfterQueueEnd, shuffleQueue });
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
      ipcRenderer.send('songChange', currentSong);
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
      Object.assign(
        {},
        PlayerActions,
        QueueActions,
        SettingsActions,
        PlaylistActions,
        EqualizerActions,
        DownloadsActions,
        LocalFileActions
      ),
      dispatch
    )
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IpcContainer));
