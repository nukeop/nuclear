const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, ipcMain, nativeImage, BrowserWindow, Menu, Tray } = require('electron');
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
let tray;
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

  installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  installExtension(REDUX_DEVTOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });


  // MacOS specific
  if (platform.isDarwin) {
    app.dock.setIcon(icon);
    icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon_apple.png'));
  }

  tray = new Tray(icon);
  tray.setToolTip('nuclear music player');
  
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
    player.on('play', mpris.onPlay);

    ipcMain.on('songChange', (event, arg) => {
      if (arg === null) {
        return;
      }

      player.metadata = {
        'mpris:trackid': player.objectPath('track/0'),
      	'mpris:length': arg.streams[0].duration * 1000 * 1000, // In microseconds
      	'mpris:artUrl': 'file://' + '/home/jcd/Pictures/terry/140414TerryADavis.jpg',// arg.thumbnail,
      	'xesam:title': arg.name,
      	'xesam:artist': arg.artist
      };
    });
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
