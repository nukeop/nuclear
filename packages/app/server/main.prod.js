import 'regenerator-runtime';

import { transformSource } from '@nuclear/core';
import { app, ipcMain } from 'electron';
import path from 'path';
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
import logger from './services/loggerProd';
import * as platform from './services/platform';
import Container from './helpers/container';

let container;
const services = [
  { provide: 'acousticId', useClass: AcousticId },
  { provide: 'download', useClass: Download },
  { provide: 'httpApi', useClass: HttpApi },
  { provide: 'localLibrary', useClass: LocalLibrary },
  { provide: 'platform', useValue: platform },
  { provide: 'store', useClass: Store },
  { provide: 'window', useClass: Window },
  { provide: 'youtubeSearch', useValue: trackSearch },
  { provide: 'logger', useValue: logger },
  { provide: 'ipcLogger', useValue: logger },
  { provide: 'httpLogger', useValue: logger },
  { provide: 'mprisLogger', useValue: logger.create({ name: 'mpris' }) },
  { provide: 'mpris', useClass: platform.isLinux() ? Mpris : class EmptyClass{} }
];

const ipcControllers = [
  DownloadIpcCtrl,
  LocalLibraryIpcCtrl,
  PlayerIpcCtrl,
  SettingsIpcCtrl
];

app.on('ready', () => {
  app.transformSource = transformSource;
  container = new Container({ ipcControllers, services }, { ipc: ipcMain });
  const window = container.resolve('window');

  container.ipcListen();

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  window.once('ready-to-show', window.show);
});

app.on('window-all-closed', async () => {
  const store = container.resolve('store');

  if (store.getOption('api.enabled')) {
    const httpApi = container.resolve('httpApi');
    await httpApi.close();
  }
  app.quit();
});
