import { ipcRenderer } from 'electron';

function onNext(event) {
  console.log(event);
}

function onPrevious(event) {
  console.log(event);
}

function onPause(event) {
  console.log(event);
}

function onPlayPause(event) {
  console.log(event);
}

function onStop(event) {
  console.log(event);
}

function onPlay(event) {
  console.log(event);
}

function onSongChange(song) {

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
