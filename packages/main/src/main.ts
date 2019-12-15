import 'isomorphic-fetch';
import 'reflect-metadata';

import { app } from 'electron';
import logger from 'electron-timber';

import { controllers, services } from './ioc';
import HttpApi from './services/http';
import Store from './services/store';
import Window from './services/window';
import Config from './services/config';
import systemApi from './services/system-api';
import Container from './utils/container';
import Platform from './services/platform';

let container: Container;

app.on('ready', async () => {
  try {
    container = new Container({ controllers, services });
    const config = container.get<Config>(Config);
    const platform = container.get<Platform>(Platform);
    const store = container.get<Store>(Store);
    const window = container.get<Window>(Window);

    await container.bindAsync({
      provide: systemApi,
      usePromise: import(`./services/system-api/${platform.getPlatform()}`)
    });

    if (config.isDev()) {
      // try {
      //   const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, default: installExtension } = await import('electron-devtools-installer');

      //   await Promise.all([
      //     installExtension(REACT_DEVELOPER_TOOLS),
      //     installExtension(REDUX_DEVTOOLS)
      //   ]);
      //   logger.log('devtools installed');
      // } catch (err) {
      //   logger.warn('something fails while trying to install devtools');
      // }

      await store.setAvailableHttpPort(3000, 3100);
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
