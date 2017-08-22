const { app, nativeImage, BrowserWindow } = require('electron');
const platform = require('electron-platform');
const path = require('path');
const url = require('url');
const mpris = require('./mpris');
var Player;

// GNU/Linux-specific
if (!platform.isDarwin && !platform.isWin32) {
  Player = require('mpris-service');
}

let win;
let player;
let icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon.png'));

function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: false,
    icon: icon,
    webPreferences: {
      experimentalFeatures: true
    }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.prod.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('closed', () => {
    win = null;
  });

  // MacOS specific
  if (platform.isDarwin) {
    app.dock.setIcon(icon);
  }

  // GNU/Linux-specific
  if (!platform.isDarwin && !platform.isWin32) {
    player = Player({
      name: 'nuclear',
      identity: 'nuclear music player',
      supportedUriSchemes: ['file'],
      supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
      supportedInterfaces: ['player'],
      desktopEntry: 'nuclear'
    });

    player.on('quit', function () {
  	   win = null;
    });

    player.on('next', mpris.onNext);
    player.on('previous', mpris.onPrevious);
    player.on('pause', mpris.onPause);
    player.on('playpause', mpris.onPlayPause);
    player.on('stop', mpris.onStop);
    player.on('play', mpris.onplay);
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
