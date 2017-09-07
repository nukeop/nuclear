import { ipcRenderer } from 'electron';

function onNext(event, actions) {
  actions.nextSong();
}

function onPrevious(event, actions) {
  actions.previousSong();
}

function onPause(event, actions) {
  actions.pausePlayback();
}

function onPlayPause(event, actions, state) {
  actions.togglePlayback(state.playbackStatus);
}

function onStop(event, actions) {
  actions.pausePlayback();
}

function onPlay(event, actions) {
  actions.startPlayback();
}

function onSongChange(song) {
  ipcRenderer.send('songChange', song);
}


module.exports = {
  onNext,
  onPrevious,
  onPause,
  onPlayPause,
  onStop,
  onPlay,
  onSongChange
};
