import logger from 'electron-timber';
// const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, ipcMain, nativeImage, BrowserWindow, Menu, Tray } = require('electron');
const platform = require('electron-platform');
const path = require('path');
const url = require('url');
const mpris = require('./mpris');
const getOption = require('./store').getOption;
// var Player;

// GNU/Linux-specific
if (!platform.isDarwin && !platform.isWin32) {
  // Player = require('mpris-service');
}

let win;
let player;
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
    logger.log('Received a close message from ipc, quitting');
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
    //   player = Player({
    //     name: 'nuclear',
    //     identity: 'nuclear music player',
    //     supportedUriSchemes: ['file'],
    //     supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
    //     supportedInterfaces: ['player'],
    //     desktopEntry: 'nuclear'
    //   });

    // player.on('quit', function () {
    //    win = null;
    // });

    // player.on('next', mpris.onNext);
    // player.on('previous', mpris.onPrevious);
    // player.on('pause', mpris.onPause);
    // player.on('playpause', mpris.onPlayPause);
    // player.on('stop', mpris.onStop);
    // player.on('play', mpris.onPlay);

    ipcMain.on('songChange', (event, arg) => {
      if (arg === null) {
        return;
      }

      changeWindowTitle(arg.artist, arg.name);

      // player.metadata = {
      //   'mpris:trackid': player.objectPath('track/0'),
      //   'mpris:artUrl': arg.thumbnail,
      //   'xesam:title': arg.name,
      //   'xesam:artist': arg.artist
      // };

      // if (arg.streams && arg.streams.length > 0) {
      //   player.metadata['mpris:length'] = arg.streams[0].duration * 1000 * 1000; // In microseconds
      // }
    });

    //  ipcMain.on('play', (event, arg) => {
    //     player.playbackStatus = 'Playing';
    //   });

    //   ipcMain.on('paused', (event, arg) => {
    //     player.playbackStatus = 'Paused';
    //   });
    // } else {
    //   ipcMain.on('songChange', (event, arg) => {
    //     if (arg === null) {
    //       return;
    //     }
    //     changeWindowTitle(arg.artist, arg.name);
    //   });
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  logger.log('All windows closed, quitting');
  app.quit();
});
