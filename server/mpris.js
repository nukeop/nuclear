import logger from 'electron-timber';
import { ipcMain } from 'electron';

let rendererWindow = null;

// const events = ['raise', 'quit', 'next', 'previous', 'pause', 'playpause', 'stop', 'play', 'seek', 'position', 'open', 'volume', 'settings'];

ipcMain.on('started', event => {
  logger.log('Renderer process started and registered.');
  rendererWindow = event.sender;
});


function onNext() {
  rendererWindow.send('next');
}

function onPrevious() {
  rendererWindow.send('previous');
}

function onPause() {
  rendererWindow.send('pause');
}

function onPlayPause() {
  rendererWindow.send('playpause');
}

function onStop() {
  rendererWindow.send('stop');
}

function onPlay() {
  rendererWindow.send('play');
}

function onVolume(volume) {
  rendererWindow.send('volume', volume);
}

function onSeek(position) {
  rendererWindow.send('seek', position);
}

function onSettings(settings) {
  rendererWindow.send('settings', settings);
}

function onMute() {
  rendererWindow.send('mute');
}

function onEmptyQueue() {
  rendererWindow.send('empty-queue');
}

function onCreatePlaylist(name) {
  rendererWindow.send('create-playlist', name);
}

function onRemovePlaylist() {
  rendererWindow.send('refresh-playlists');
}

function getPlayingStatus() {
  return new Promise(resolve => {
    rendererWindow.send('playing-status');
    ipcMain.on('playing-status', (evt, data) => {
      resolve(data);
    });
  });
}

module.exports = {
  onNext,
  onPrevious,
  onPause,
  onPlayPause,
  onStop,
  onPlay,
  onSettings,
  onVolume,
  onSeek,
  onMute,
  onEmptyQueue,
  onCreatePlaylist,
  onRemovePlaylist,
  getPlayingStatus
};
