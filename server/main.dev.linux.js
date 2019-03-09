import logger from 'electron-timber';
import { setOption } from './store';
// const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, ipcMain, nativeImage, BrowserWindow, Menu, Tray } = require('electron');
const platform = require('electron-platform');
const path = require('path');
const url = require('url');
const getOption = require('./store').getOption;
const { runHttpServer, closeHttpServer } = require('./http/server');
const mpris = require('./mpris');
var Player;

// GNU/Linux-specific
if (!platform.isDarwin && !platform.isWin32) {
  Player = require('mpris-service');
}

let win;
let httpServer;
let tray;
let icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon.png'));

function changeWindowTitle(artist, title) {
  win.setTitle(`${artist} - ${title} - nuclear music player`);
}

function createWindow() {
  logger.log('Electron is ready, creating a window');
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: !getOption('framelessWindow'),
    icon: icon,
    show: false,
    webPreferences: {
      experimentalFeatures: true,
      webSecurity: false
    },
    additionalArguments: [
      getOption('disableGPU') && '--disable-gpu'
    ]
  });

  win.setTitle('nuclear music player');

  // Needs to be commented for now
  // https://github.com/electron/electron/issues/13008
  // installExtension(REACT_DEVELOPER_TOOLS)
  // .then((name) => console.log(`Added Extension:  ${name}`))
  // .catch((err) => console.log('An error occurred: ', err));

  // installExtension(REDUX_DEVTOOLS)
  // .then((name) => console.log(`Added Extension:  ${name}`))
  // .catch((err) => console.log('An error occurred: ', err));

  win.loadURL(url.format({
    pathname: 'localhost:8080',
    protocol: 'http:',
    slashes: true
  }));

  win.once('ready-to-show', () => {
    win.show();
  });

  win.webContents.openDevTools();

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
     () => {
       closeHttpServer(httpServer).then(() => app.quit());
     }
    }
  ]);

  tray = new Tray(icon);
  tray.setTitle('nuclear music player');
  tray.setToolTip('nuclear music player');
  tray.setContextMenu(trayMenu);

  ipcMain.on('close', () => {
    logger.log('Received a close message from ipc, quitting');
    app.quit();
  });

  ipcMain.on('minimize', () => {
    win.minimize();
  });

  ipcMain.on('maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });

  ipcMain.on('restart-api', () => {
    closeHttpServer(httpServer).then(() => {
      httpServer = runHttpServer({ log: true, port: getOption('api.port') });
    });
  });

  ipcMain.on('stop-api', () => {
    closeHttpServer(httpServer);
  });

  // GNU/Linux-specific
  if (!platform.isDarwin && !platform.isWin32) {
    let hashCode = function(str) {
      str = str.toString();
      let hash = 0;
      if (str.length == 0) {
        return hash;
      }
      for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }

    let secToUs = function(sec) {
      return Math.floor(Number(sec) * 1e6);
    }

    let positionSec = 0.0;

    let player = Player({
      name: 'nuclear',
      identity: 'nuclear music player',
      supportedUriSchemes: ['file'],
      supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
      supportedInterfaces: ['player'],
      desktopEntry: 'nuclear'
    });

    if (getOption('loopAfterQueueEnd')) {
      player.loopStatus = 'Track';
    } else {
      player.loopStatus = 'None';
    }

    player.shuffle = getOption('shuffleQueue');

    player.volume = 1.0;

    player.getPosition = function() {
      return secToUs(positionSec);
    };

    player.on('quit', function () {
      win = null;
    });

    player.on('next', mpris.onNext);
    player.on('previous', mpris.onPrevious);
    player.on('pause', mpris.onPause);
    player.on('playpause', mpris.onPlayPause);
    player.on('stop', mpris.onStop);
    player.on('play', mpris.onPlay);
    player.on('volume', function(volume) {
      mpris.onVolume(volume * 100);
    });
    player.on('position', function(e) {
      let {trackId, position} = e;
      if (player.metadata && player.metadata['mpris:trackid'] === trackId) {
        mpris.onSeek(position / 1e3);
      }
    });
    player.on('seek', function(seek) {
      let seekTo = (positionSec * 1e3) + (seek / 1e3);
      mpris.onSeek(seekTo);
    });
    player.on('shuffle', function(shuffle) {
      mpris.onSettings({shuffleQueue: shuffle});
    });
    player.on('loopStatus', function(status) {
      if (status === 'None') {
        mpris.onSettings({ loopAfterQueueEnd: false});
      } else if (status === 'Track') {
        mpris.onSettings({loopAfterQueueEnd: true});
      } else {
        // XXX 'Playlist' loop status is not supported, just do the closest
        // thing.
        mpris.onSettings({loopAfterQueueEnd: true});
      }
    });

    let lastId = null;
    ipcMain.on('songChange', (event, arg) => {
      if (arg === null) {
        return;
      }

      changeWindowTitle(arg.artist, arg.name);

      if (arg.streams && arg.streams.length > 0) {
        let id = arg.streams[0].id;
        if (id !== lastId) {
          lastId = id;
          let metadata = {
            'mpris:trackid': player.objectPath(`track/${Math.abs(hashCode(id))}`),
            'mpris:artUrl': arg.thumbnail || '',
            'xesam:title': arg.name || '',
            'xesam:artist': arg.artist || ''
          };
          if (arg.streams[0].source === 'Youtube') {
            metadata['mpris:length'] = secToUs(Number(arg.streams[0].duration));
          } else {
            // XXX: Soundcloud is in ms, and I think this is reasonble, but I
            // don't know what other duration formats to expect here.
            metadata['mpris:length'] = Math.floor(Number(arg.streams[0].duration) * 1e3);
          }
          player.positionSec = 0;
          player.metadata = metadata;
        }
      }
    });

    ipcMain.on('play', (event, arg) => {
      player.playbackStatus = 'Playing';
    });

    ipcMain.on('paused', (event, arg) => {
      player.playbackStatus = 'Paused';
    });

    ipcMain.on('volume', (event, volume) => {
      player.volume = volume / 100;
    });

    ipcMain.on('playbackProgress', (event, progress) => {
      positionSec = progress;
    });

    ipcMain.on('seek', (event, seek) => {
      // this is in miliseconds
      player.positionSec = seek / 1e3;
      player.seeked(Math.floor(seek * 1e3));
    });

    ipcMain.on('set-option', (event, kv) => {
      let {key, value} = kv;
      if (key === 'loopAfterQueueEnd') {
        if (value) {
          player.loopStatus = 'Track';
        } else {
          player.loopStatus = 'None';
        }
      } else if (key === 'shuffleQueue') {
        player.shuffle = value;
      }
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

app.on('ready', () => {
  createWindow();

  if (getOption('api.enabled')) {
    setOption('api.port', 3000);
    httpServer = runHttpServer({ log: true, port: 3000 });
  }
});

app.on('window-all-closed', () => {
  logger.log('All windows closed, quitting');
  closeHttpServer(httpServer).then(() => app.quit());
});
