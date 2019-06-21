const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const {
  app,
  ipcMain,
  nativeImage,
  BrowserWindow,
  Menu,
  Tray
} = require('electron');
const platform = require('electron-platform');
const path = require('path');
const url = require('url');
const { getOption, setOption } = require('./store');
const { runHttpServer, closeHttpServer } = require('./http/server');
import { registerDownloadsEvents } from './downloads';
const getPort = require('get-port');

let httpServer;
let win;
let tray;
let icon = nativeImage.createFromPath(
  path.resolve(__dirname, 'resources', 'media', 'icon.png')
);

function changeWindowTitle (artist, title) {
  win.setTitle(`${artist} - ${title} - Nuclear Music Player`);
}

function createWindow () {
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
        app.quit();
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
    if (platform.isDarwin) {
      win.isFullScreen() ? win.setFullScreen(false) : win.setFullScreen(true);
    } else {
      win.isMaximized() ? win.unmaximize() : win.maximize();
    }
  });

  ipcMain.on('songChange', (event, arg) => {
    if (arg === null) {
      return;
    }
    changeWindowTitle(arg.artist, arg.name);
  });

  ipcMain.on('restart-api', () => {
    closeHttpServer(httpServer).then(() => {
      httpServer = runHttpServer({ log: true, port: getOption('api.port') });
    });
  });

  ipcMain.on('stop-api', () => {
    closeHttpServer(httpServer);
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
  closeHttpServer(httpServer).then(() => app.quit());
});
