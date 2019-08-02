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

import {
  onNext,
  onPrevious,
  onPause,
  onPlayPause,
  onStop,
  onPlay,
  onSongChange,
  onSettings,
  onVolume,
  onSeek,
  sendPlayingStatus,
  sendQueueItems,
  onMute,
  onEmptyQueue,
  onCreatePlaylist,
  onRefreshPlaylists,
  onUpdateEqualizer,
  onSetEqualizer,
  onLocalFiles,
  onLocalFilesError
} from '../../mpris';

class IpcContainer extends React.Component {
  componentDidMount() {
    ipcRenderer.send('started');
    ipcRenderer.send('refresh-localfolders');
    ipcRenderer.on('next', event => onNext(event, this.props.actions));
    ipcRenderer.on('previous', event => onPrevious(event, this.props.actions));
    ipcRenderer.on('pause', event => onPause(event, this.props.actions));
    ipcRenderer.on('playpause', event => onPlayPause(event, this.props.actions, this.props.player));
    ipcRenderer.on('stop', event => onStop(event, this.props.actions));
    ipcRenderer.on('play', event => onPlay(event, this.props.actions));
    ipcRenderer.on('settings', (event, data) => onSettings(event, data, this.props.actions));
    ipcRenderer.on('mute', event => onMute(event, this.props.actions, this.props.player));
    ipcRenderer.on('volume', (event, data) => onVolume(event, data, this.props.actions));
    ipcRenderer.on('seek', (event, data) => onSeek(event, data, this.props.actions));
    ipcRenderer.on('playing-status', event => sendPlayingStatus(event, this.props.player, this.props.queue));
    ipcRenderer.on('empty-queue', event => onEmptyQueue(event, this.props.actions));
    ipcRenderer.on('queue', event => sendQueueItems(event, this.props.queue.queueItems));
    ipcRenderer.on('create-playlist', (event, name) => onCreatePlaylist(event, { name, tracks: this.props.queue.queueItems }, this.props.actions));
    ipcRenderer.on('refresh-playlists', (event) => onRefreshPlaylists(event, this.props.actions));
    ipcRenderer.on('update-equalizer', (event, data) =>  onUpdateEqualizer(event, this.props.actions, data));
    ipcRenderer.on('set-equalizer', (event, data) => onSetEqualizer(event, this.props.actions, data));
    ipcRenderer.on('local-files', (event, data) => onLocalFiles(event, this.props.actions, data));
    ipcRenderer.on('local-files-error', (event, err) => onLocalFilesError(event, this.props.actions, err));

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
      logger.error(data);
    });
  }

  componentWillReceiveProps(nextProps){
    if (this.props !== nextProps) {
      const currentSong = nextProps.queue.queueItems[nextProps.queue.currentSong];
      onSongChange(currentSong);
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    queue: state.queue
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
