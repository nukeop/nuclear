import 'regenerator-runtime';
import process from 'process';
import logger from 'electron-timber';
import platform from 'electron-platform';
import path from 'path';
import url from 'url';
import { app, ipcMain, nativeImage, BrowserWindow, Menu, Tray } from 'electron';
import { transformSource } from '@nuclear/core';

const getOption = require('./store').getOption;
const { runHttpServer, closeHttpServer } = require('./http/server');
import { registerDownloadsEvents } from './downloads';
import MprisPlayer from './mpris';

let httpServer;
let mprisPlayer;
let win;
let tray;
let icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon.png'));

function changeWindowTitle(artist, title) {
  win.setTitle(`${artist} - ${title} - Nuclear Music Player`);
}

process.on('uncaughtException', error => {
  logger.log(error);
});

function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: !getOption('framelessWindow'),
    icon,
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

  app.transformSource = transformSource;

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.once('ready-to-show', () => {
    win.show();

    mprisPlayer = new MprisPlayer(win, app);
    mprisPlayer.listen();
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
  tray.setTitle('nuclear music player');
  tray.setToolTip('nuclear music player');
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

  ipcMain.on('restart-api', () => {
    closeHttpServer(httpServer).then(() => {
      httpServer = runHttpServer({ port: getOption('api.port') });
    });
  });

  ipcMain.on('stop-api', () => {
    closeHttpServer(httpServer);
  });

  ipcMain.on('songChange', (event, arg) => {
    if (arg === null) {
      return;
    }
    changeWindowTitle(arg.artist, arg.name);
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
