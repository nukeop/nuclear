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
