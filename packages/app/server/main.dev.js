import 'regenerator-runtime';
import logger from 'electron-timber';
import platform from 'electron-platform';
import path from 'path';
import url from 'url';
import getPort from 'get-port';
import { app, ipcMain, nativeImage, BrowserWindow, Menu, Tray } from
  'electron';

import { runHttpServer, closeHttpServer } from './http/server';
import { setOption } from './store';
import { registerDownloadsEvents } from './downloads';

import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';
import { getOption } from './store';

let httpServer;
let tray;
let win;
let icon = nativeImage.createFromPath(
  path.resolve(__dirname, 'resources', 'media', 'icon.png')
);
logger.hookConsole({
	main: true
});

function changeWindowTitle (artist, title) {
  win.setTitle(`${artist} - ${title} - Nuclear Music Player`);
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

  win.setTitle('Nuclear Music Player');

  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  win.loadURL(
    url.format({
      pathname: 'localhost:8080',
      protocol: 'http:',
      slashes: true
    })
  );

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
    icon = nativeImage.createFromPath(
      path.resolve(__dirname, 'resources', 'media', 'icon_apple.png')
    );
  }

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
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
    logger.log('Received a close message from ipc, quitting');
    closeHttpServer(httpServer).then(() => app.quit());
  });

  ipcMain.on('minimize', () => {
    win.minimize();
  });

  ipcMain.on('maximize', () => {
    if (platform.isDarwin) {
      win.isFullScreen() ? win.setFullScreen(false) : win.setFullScreen(true);
    } else {
      win.isMaximized() ? win.unmaximize() : win.maximize();
    }
  });

  ipcMain.on('restart-api', () => {
    closeHttpServer(httpServer).then(() => {
      httpServer = runHttpServer({ log: true, port: getOption('api.port') });
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

  (async () => {
    const availablePort = await getPort({ port: getPort.makeRange(3000, 3100) });
    if (getOption('api.enabled')) {
      setOption('api.port', availablePort);
      httpServer = runHttpServer({ log: true, port: availablePort });
    }
  })();
});

app.on('window-all-closed', () => {
  logger.log('All windows closed, quitting');
  closeHttpServer(httpServer).then(() => app.quit());
});
