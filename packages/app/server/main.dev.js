import 'regenerator-runtime';

import { transformSource } from '@nuclear/core';
import { app, ipcMain } from 'electron';
import logger from 'electron-timber';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';
import getPort from 'get-port';
import url from 'url';

import DownloadIpcCtrl from './ipc/download';
import LocalLibraryIpcCtrl from './ipc/localLibrary';
import PlayerIpcCtrl from './ipc/player';
import SettingsIpcCtrl from './ipc/settings';

import { trackSearch } from '../app/rest/youtube-search';
import AcousticId from './services/acousticId';
import Download from './services/download';
import HttpApi from './services/http';
import LocalLibrary from './services/localLibrary';
import Mpris from './services/mpris';
import Store from './services/store';
import Window from './services/window';
import * as platform from './services/platform';
import Container from './helpers/container';

let container;
const services = [
  { provide: 'acousticId', useClass: AcousticId },
  { provide: 'download', useClass: Download },
  { provide: 'httpApi', useClass: HttpApi },
  { provide: 'localLibrary', useClass: LocalLibrary },
  { provide: 'store', useClass: Store },
  { provide: 'window', useClass: Window },
  { provide: 'platform', useValue: platform },
  { provide: 'youtubeSearch', useValue: trackSearch },
  { provide: 'logger', useValue: logger },
  { provide: 'ipcLogger', useValue: logger.create({ name: 'ipc api' }) },
  { provide: 'httpLogger', useValue: logger.create({ name: 'http api' }) }
];

const ipcControllers = [
  DownloadIpcCtrl,
  LocalLibraryIpcCtrl,
  PlayerIpcCtrl,
  SettingsIpcCtrl
];

app.on('ready', async () => {
  try {
    await Promise.all([
      installExtension(REACT_DEVELOPER_TOOLS),
      installExtension(REDUX_DEVTOOLS)
    ]);
    logger.log('devtools installed');
  } catch (err) {
    logger.warn('something fails while trying to install devtools');
  }

  app.transformSource = transformSource;

  try {
    if (platform.isLinux()) {
      services.push(
        { provide: 'mprisLogger', useValue: logger.create({ name: 'mpris' }) },
        { provide: 'mpris', useClass: Mpris }
      );
    }

    const container = new Container({ ipcControllers, services }, { ipc: ipcMain });
    const store = container.resolve('store');
    const window = container.resolve('window');
  
    container.ipcListen();

    window.loadURL(
      url.format({
        pathname: 'localhost:8080',
        protocol: 'http:',
        slashes: true
      })
    );
  
    window.once('ready-to-show', () => {
      window.show();
      window.webContents.openDevTools();
    });

    const availablePort = await getPort({ port: getPort.makeRange(3000, 3100) });
    store.setOption('api.port', availablePort);
  } catch (err) {
    logger.error('something fail during app bootstrap');
    logger.error(err);

    return app.quit();
  }
});

app.on('window-all-closed', async () => {  
  try {
    logger.log('All windows closed, quitting');
    const httpApi = container.resolve('httpApi');
    await httpApi.close();

    app.quit();
  } catch (err) {
    logger.error('something fail during app close');
    logger.error(err);
    app.quit();
  }
});
