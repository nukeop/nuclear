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

export function onSongChange(song) {
  ipcRenderer.send('songChange', song);
}

export function sendPlay() {
  ipcRenderer.send('play');
}

export function sendPaused() {
  ipcRenderer.send('paused');
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

export function sendPlayingStatus(event, playerState, queueState) {
  try {
    const { artist, name, thumbnail } = queueState.queueItems[queueState.currentSong];

    ipcRenderer.send('playing-status', { ...playerState, artist, name, thumbnail });
  } catch (err) {
    ipcRenderer.send('playing-status', playerState);
  }
}

export function sendQueueItems(event, queueItems) {
  ipcRenderer.send('queue', queueItems);
}
