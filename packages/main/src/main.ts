import 'reflect-metadata';
import 'v8-compile-cache';

import { app, protocol } from 'electron';
import { logger } from '@nuclear/core';

import { controllers, services } from './ioc';
import Config from './services/config';
import Discord from './services/discord';
import Store from './services/store';
import TrayMenu from './services/trayMenu';
import TouchbarMenu from './services/touchbar';
import Window from './services/window';
import Container from './utils/container';
import LocalLibrary from './services/local-library';
import HttpApi from './services/http';
import LocalLibraryDb from './services/local-library/db';
import ListeningHistoryDb from './services/listening-history/db';
import { handleCertificateError } from './certificate';

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('no-sandbox');

let container: Container;

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@electron/remote/main').initialize();
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
    const touchbarMenu = container.get<TouchbarMenu>(TouchbarMenu);
    const window = container.get<Window>(Window);
    const discord = container.get<Discord>(Discord);
    const localLibraryDb = container.get<LocalLibraryDb>(LocalLibraryDb);
    const listeningHistoryDb = container.get<ListeningHistoryDb>(ListeningHistoryDb);

    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(pathname);
    });

    if (config.isDev()) {
      await Promise.all([
        window.installDevTools(),
        store.setAvailableHttpPort(3000, 3100)
      ]);
    }

    await localLibraryDb.connect();
    await listeningHistoryDb.connect();
    container.listen();
    await window.load();
    if (store.getOption('showTrayIcon')) {
      trayMenu.init();
    }
    touchbarMenu.init();
    if (store.getOption('discordRichPresence')) {
      discord.init();
    }

    // if args is pass to  nuclear command and its a path to a supported file, just play it.
    if (config.isProd() && process.argv[1] && config.isFileSupported(process.argv[1])) {
      localLibrary.playStartupFile(process.argv[1]);
    }
  } catch (err) {
    logger.error('Something failed during app bootstrap');
    logger.error(err);

    app.quit();
  }
});

app.on('certificate-error', handleCertificateError);

app.on('window-all-closed', async () => {
  try {
    logger.log('All windows closed, quitting');
    const store = container.get<Store>(Store);
    const discord = container.get<Discord>(Discord);
    const localDb = container.get<LocalLibraryDb>(LocalLibraryDb);

    if (store.getOption('api.enabled')) {
      const httpApi = container.get<HttpApi>(HttpApi);
      await httpApi.close();
    }

    await discord.clear();
    await localDb.cleanUnusedThumbnail();
  } catch (err) {
    logger.error('Something failed during app close');
    logger.error(err);
  } finally {
    logger.log('Quitting app');
    app.quit();
  }
});
