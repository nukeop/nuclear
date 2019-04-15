require('babel-polyfill');
const { app, ipcMain, nativeImage, BrowserWindow, Menu, Tray } = require('electron');
const platform = require('electron-platform');
const path = require('path');
const url = require('url');
const getOption = require('./store').getOption;
const { runHttpServer, closeHttpServer } = require('./http/server');
import { registerDownloadsEvents } from './downloads';

let httpServer;
let win;
let tray;
let icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon.png'));

function changeWindowTitle(artist, title) {
  win.setTitle(`${artist} - ${title} - Nuclear Music Player`);
}

function createWindow() {
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

  win.setTitle('Nuclear Music Player');

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.once('ready-to-show', () => {
    win.show();
  });

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
  tray.setTitle('Nuclear Music Player');
  tray.setToolTip('Nuclear Music Player');
  tray.setContextMenu(trayMenu);

  registerDownloadsEvents(win);

  ipcMain.on('close', () => {
    closeHttpServer(httpServer).then(() => app.quit());
  });

  ipcMain.on('minimize', () => {
    win.minimize();
  });

  ipcMain.on('maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });

  ipcMain.on('songChange', (event, arg) => {
    if (arg === null) {
      return;
    }
    changeWindowTitle(arg.artist, arg.name);
  });

  ipcMain.on('restart-api', () => {
    closeHttpServer(httpServer).then(() => {
      httpServer = runHttpServer({ port: getOption('api.port') });
    });
  });

  ipcMain.on('stop-api', () => {
    closeHttpServer(httpServer);
  });
}

app.on('ready', () => {
  createWindow();
  if (getOption('api.enabled')) {
    httpServer = runHttpServer({ port: getOption('api.port') });
  }
});

app.on('window-all-closed', () => {
  closeHttpServer(httpServer).then(() => app.quit());
});
