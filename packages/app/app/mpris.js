import { ipcRenderer } from 'electron';

export function onNext(event, actions) {
  actions.nextSong();
}

export function onPrevious(event, actions) {
  actions.previousSong();
}

export function onPause(event, actions) {
  actions.pausePlayback();
}

export function onPlayPause(event, actions, state) {
  actions.togglePlayback(state.playbackStatus);
}

export function onStop(event, actions) {
  actions.pausePlayback();
}

export function onPlay(event, actions) {
  actions.startPlayback();
}

export function onSettings(event, data, actions) {
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
}

export function onMute(event, actions, playerState) {
  if (playerState.muted) {
    actions.unMute();
  } else {
    actions.mute();
  }
} 

export function onVolume(event, data, actions) {
  actions.updateVolume(data);
}

export function onSeek(event, data, actions) {
  actions.updateSeek(data);
}

export function onEmptyQueue(event, actions) {
  actions.clearQueue();
}

export function onSelectTrack(index, actions) {
  actions.selectSong(index);
}

export function onCreatePlaylist(event, { tracks, name }, actions) {
  actions.addPlaylist(tracks, name);
}

export function onRefreshPlaylists(event, actions) {
  actions.loadPlaylists();
}

export function onSetEqualizer(event, actions, equalizer) {
  actions.setEqualizer(equalizer);
}

export function onUpdateEqualizer(event, actions, data) {
  actions.updateEqualizer(data);
}

export function onLocalFilesProgress(event, actions, {scanProgress, scanTotal}) {
  actions.scanLocalFoldersProgress(scanProgress, scanTotal);
}

export function onLocalFiles(event, actions, data) {
  actions.scanLocalFoldersSuccess(data);
}

export function onLocalFilesError(event, actions, data) {
  actions.scanLocalFoldersFailed(data);
}

export function onSongChange(song) {
  ipcRenderer.send('songChange', song);
}

export function sendPlay() {
  ipcRenderer.send('play');
}

export function sendPaused() {
  ipcRenderer.send('paused');
}

export function sendVolume(data) {
  ipcRenderer.send('volume', data);
}

export function sendShuffle(data) {
  ipcRenderer.send('shuffle', data);
}

export function sendLoop(data) {
  ipcRenderer.send('loopStatus', data);
}

export function sendClose() {
  ipcRenderer.send('close');
}

export function sendMinimize() {
  ipcRenderer.send('minimize');
}

export function sendMaximize() {
  ipcRenderer.send('maximize');
}

export function restartApi() {
  ipcRenderer.send('restart-api');
}

export function stopApi() {
  ipcRenderer.send('stop-api');
}

export function refreshLocalFolders() {
  ipcRenderer.send('refresh-localfolders');
}

export function getLocalFolders() {
  return ipcRenderer.sendSync('get-localfolders');
}

export function setLocalFolders(localFolders) {
  ipcRenderer.send('set-localfolders', localFolders);
}

export function sendPlayingStatus(event, playerState, queueState, { loopAfterQueueEnd, shuffleQueue }) {
  try {
    const { artist, name, thumbnail } = queueState.queueItems[queueState.currentSong];

    ipcRenderer.send('playing-status', { ...playerState, artist, name, thumbnail, loopAfterQueueEnd, shuffleQueue });
  } catch (err) {
    ipcRenderer.send('playing-status', { ...playerState, loopAfterQueueEnd, shuffleQueue });
  }
}

export function sendQueueItems(queueItems) {
  ipcRenderer.send('queue', queueItems);
}

export function addTrack(track) {
  ipcRenderer.send('addTrack', track);
}

export function removeTrack(track) {
  ipcRenderer.send('removeTrack', track);
}

export function onActivatePlaylist(playlists, playlistName, streamProviders, actions) {
  const tracks = playlists.find(({ name }) => playlistName === name).tracks;

  actions.clearQueue();
  actions.addPlaylistTracksToQueue(streamProviders, tracks);
}
