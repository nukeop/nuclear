import { ipcMain } from 'electron';
import { Class } from 'type-fest';

import DownloadCtrl from './controllers/download';
import LocalLibraryCtrl from './controllers/local-library';
import LoggerCtrl from './controllers/logger';
import PlayerCtrl from './controllers/player';
import SettingsCtrl from './controllers/settings';

import AcousticId from './services/acoustic-id';
import Config from './services/config';
import Discord from './services/discord';
import Download from './services/download';
import HttpApi from './services/http';
import $ipc from './services/ipc';
import LocalLibrary from './services/local-library';
import LocalLibraryDb from './services/local-library/db';
import Logger, { $httpApiLogger, $ipcLogger, $mainLogger, $systemApiLogger } from './services/logger';
import Platform from './services/platform';
import Store from './services/store';
import Window from './services/window';
import SystemApi from './services/system-api';
import TrayMenu from './services/trayMenu';

import { ServiceProvider } from './utils/types';
import TouchbarMenu from './services/touchbar';
import ListeningHistoryService from './services/listening-history';
import ListeningHistoryDb from './services/listening-history/db';
import ListeningHistoryController from './controllers/listening-history';
import ElectronUtilsIpcCtrl from './controllers/electron-utils';

const services: ServiceProvider[] = [
  { useClass: AcousticId },
  { useClass: Config },
  { useClass: Discord },
  { useClass: Download },
  { useClass: HttpApi },
  { useClass: LocalLibrary },
  { useClass: LocalLibraryDb },
  { useClass: ListeningHistoryService },
  { useClass: ListeningHistoryDb },
  { useClass: Store },
  { useClass: Window },
  { useClass: Platform },
  { useClass: SystemApi },
  { useClass: TrayMenu },
  { useClass: TouchbarMenu },
  { provide: $ipc, useValue: ipcMain },
  { provide: $mainLogger, useValue: new Logger() },
  { provide: $ipcLogger, useValue: new Logger('ipc api') },
  { provide: $httpApiLogger, useValue: new Logger('http api') },
  { provide: $systemApiLogger, useValue: new Logger('system api') }
];

const controllers: Class[] = [
  DownloadCtrl,
  ElectronUtilsIpcCtrl,
  LocalLibraryCtrl,
  ListeningHistoryController,
  LoggerCtrl,
  PlayerCtrl,
  SettingsCtrl
];

export { services, controllers };
