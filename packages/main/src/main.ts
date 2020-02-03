import 'reflect-metadata';

import { transformSource } from '@nuclear/core';
import { app } from 'electron';
import logger from 'electron-timber';

import { controllers, services } from './ioc';
import Config from './services/config';
import Discord from './services/discord';
import Store from './services/store';
import TrayMenu from './services/trayMenu';
import Window from './services/window';
import Container from './utils/container';
import LocalLibrary from './services/local-library';
import HttpApi from './services/http';
import LocalLibraryDb from './services/local-library/db';

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(app as any).transformSource = transformSource;

let container: Container;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', async (event, commandLine) => {
    const window = container.get<Window>(Window);
    const localLibrary = container.get<LocalLibrary>(LocalLibrary);
    const config = container.get<Config>(Config);

    // Another instance is fired, lets focus the first one and play the eventual song
    if (window) {
      window.restore();
      window.focus();

      if (commandLine[1] && config.isFileSupported(commandLine[1])) {
        localLibrary.playStartupFile(commandLine[1]);
      }
    }
  });
}

app.on('ready', async () => {
  try {
    container = new Container({ controllers, services });
    const config = container.get<Config>(Config);
    const localLibrary = container.get<LocalLibrary>(LocalLibrary);
    const store = container.get<Store>(Store);
    const trayMenu = container.get<TrayMenu>(TrayMenu);
    const window = container.get<Window>(Window);
    const discord = container.get<Discord>(Discord);
    const localLibraryDb = container.get<LocalLibraryDb>(LocalLibraryDb);

    if (config.isDev()) {
      await Promise.all([
        window.installDevTools(),
        store.setAvailableHttpPort(3000, 3100)
      ]);
    }

    await localLibraryDb.connect();
    container.listen();
    await window.load(),
    trayMenu.init();
    discord.init();

    // if args is pass to  nuclear command and its a path to a supported file, just play it.
    if (config.isProd() && process.argv[1] && config.isFileSupported(process.argv[1])) {
      localLibrary.playStartupFile(process.argv[1]);
    }
  } catch (err) {
    logger.error('something fail during app bootstrap');
    logger.error(err);

    return app.quit();
  }
});

app.on('window-all-closed', async () => {
  try {
    logger.log('All windows closed, quitting');
    const store = container.get<Store>(Store);
    const discord = container.get<Discord>(Discord);


    if (store.getOption('api.enabled')) {
      const httpApi = container.get<HttpApi>(HttpApi);
      await httpApi.close();
    }

    discord.clear();
    app.quit();
  } catch (err) {
    logger.error('something fail during app close');
    logger.error(err);
  }
});
