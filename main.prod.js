const { app, ipcMain, nativeImage, BrowserWindow, Menu, Tray } = require('electron');
const platform = require('electron-platform');
const path = require('path');
const url = require('url');
const mpris = require('./server/mpris');
const store = require('./server/store').store;
var Player;

// GNU/Linux-specific
if (!platform.isDarwin && !platform.isWin32) {
  Player = require('mpris-service');
}

let win;
let player;
let tray;
let icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon.png'));
let settings = store.get('settings').value();

function changeWindowTitle(artist, title) {
  win.setTitle(`${artist} - ${title} - nuclear music player`);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: !settings.framelessWindow,
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
    icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon_apple.png'));
  }

  const trayMenu = Menu.buildFromTemplate([
    {label: 'Quit', type: 'normal', click:
     (menuItem, browserWindow, event) => {
       app.quit();
     }
    }
  ]);

  tray = new Tray(icon);
  tray.setTitle('nuclear music player');
  tray.setToolTip('nuclear music player');
  tray.setContextMenu(trayMenu);

  ipcMain.on('close', () => {
    app.quit();
  });

  ipcMain.on('minimize', () => {
    win.minimize();
  });

  ipcMain.on('maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });

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

      changeWindowTitle(arg.artist, arg.name);

      player.metadata = {
        'mpris:trackid': player.objectPath('track/0'),
      	'mpris:artUrl': arg.thumbnail,
      	'xesam:title': arg.name,
      	'xesam:artist': arg.artist
      };

      if (arg.streams && arg.streams.length > 0) {
	player.metadata['mpris:length'] = arg.streams[0].duration * 1000 * 1000; // In microseconds
      }
    });

    ipcMain.on('play', (event, arg) => {
      player.playbackStatus = 'Playing';
    });

    ipcMain.on('paused', (event, arg) => {
      player.playbackStatus = 'Paused';
    });
  } else {
    ipcMain.on('songChange', (event, arg) => {
      if (arg === null) {
        return;
      }
      changeWindowTitle(arg.artist, arg.name);
    });
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
