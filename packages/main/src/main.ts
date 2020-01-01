import 'reflect-metadata';

import { app } from 'electron';
import logger from 'electron-timber';
import path from 'path';
import { controllers, services } from './ioc';
import Config from './services/config';
import HttpApi from './services/http';
import Store from './services/store';
import TrayMenu from './services/trayMenu';
import Window from './services/window';
import Container from './utils/container';
import LocalLibrary from './services/local-library';

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let container: Container;

app.on('ready', async () => {
  try {
    container = new Container({ controllers, services });
    const config = container.get<Config>(Config);
    const localLibrary = container.get<LocalLibrary>(LocalLibrary);
    const store = container.get<Store>(Store);
    const trayMenu = container.get<TrayMenu>(TrayMenu);
    const window = container.get<Window>(Window);

    if (config.isDev()) {
      await Promise.all([
        window.installDevTools(),
        store.setAvailableHttpPort(3000, 3100)
      ]);
    }

    container.listen();
    await window.load();
    trayMenu.init();

    // if args is pass to  nuclear command and its a path to a supported file, just play it.
    if (config.isProd() && process.argv[1]) {
      try {
        const meta = await localLibrary.getSingleMeta(path.resolve(process.cwd(), process.argv[1]));

        window.send('play-startup-track', meta);
      } catch (err) {
        logger.error('Error trying to play audio file');
        logger.error(err);
      }
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

    if (store.getOption('api.enabled')) {
      const httpApi = container.get<HttpApi>(HttpApi);
      await httpApi.close();
    }

    app.quit();
  } catch (err) {
    logger.error('something fail during app close');
    logger.error(err);
  }
});
