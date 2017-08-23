const { ipcMain } = require('electron');

var rendererWindow = null;

var events = ['raise', 'quit', 'next', 'previous', 'pause', 'playpause', 'stop', 'play', 'seek', 'position', 'open', 'volume'];

ipcMain.on('started', (event, arg) => {
  console.log('Renderer process started and registered.');
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

module.exports = {
  onNext,
  onPrevious,
  onPause,
  onPlayPause,
  onStop,
  onPlay
}
