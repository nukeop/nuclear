import 'reflect-metadata';

import { app } from 'electron';
import logger from 'electron-timber';

import { controllers, services } from './ioc';
import HttpApi from './services/http';
import Store from './services/store';
import Window from './services/window';
import Config from './services/config';
import Container from './utils/container';

let container: Container;

app.on('ready', async () => {
  try {
    container = new Container({ controllers, services });
    const config = container.get<Config>(Config);
    const store = container.get<Store>(Store);
    const window = container.get<Window>(Window);

    if (config.isDev()) {
      await Promise.all([
        window.installDevTools(),
        store.setAvailableHttpPort(3000, 3100)
      ]);
    }
    
    container.listen();
    window.load();

    window.once('ready-to-show', () => {
      window.show();
      config.isDev() && window.webContents.openDevTools();
    });
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
