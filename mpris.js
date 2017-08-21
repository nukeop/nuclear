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

}

function onPause() {

}

function onPlayPause() {

}

function onStop() {

}

function onPlay() {

}

module.exports = {
  onNext
}
