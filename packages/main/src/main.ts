import 'isomorphic-fetch';
import 'reflect-metadata';

import * as Sentry from '@sentry/electron/dist/main';
import { app } from 'electron';
import logger from 'electron-timber';
import getPort from 'get-port';
import path from 'path';
import url from 'url';

import { controllers, services } from './ioc';
import HttpApi from './services/http';
import Store from './services/store';
import Window from './services/window';
import Config from './services/config';
import systemApi from './services/system-api';
import Container from './utils/container';
import { isDev, isProd } from './utils/env';
import Platform from './services/platform';

let container: Container;

app.on('ready', async () => {
  try {
    container = new Container({ controllers, services });
    const platform = container.get<Platform>(Platform);

    await container.bindAsync({
      provide: systemApi,
      usePromise: import(`./services/system-api/${platform.getPlatform()}`)
    });

    const store = container.get<Store>(Store);
    const window = container.get<Window>(Window);

    if (isProd) {
      const config = container.get<Config>(Config);
      Sentry.init({ dsn: config.sentryDsn });

      window.loadURL(
        url.format({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true
        })
      );
    } else if (isDev) {
      try {
        const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, default: installExtension } = await import('electron-devtools-installer');

        await Promise.all([
          installExtension(REACT_DEVELOPER_TOOLS),
          installExtension(REDUX_DEVTOOLS)
        ]);
        logger.log('devtools installed');
      } catch (err) {
        logger.warn('something fails while trying to install devtools');
      }

      window.loadURL(
        url.format({
          pathname: 'localhost:8080',
          protocol: 'http:',
          slashes: true
        })
      );

      const availablePort = await getPort({ port: getPort.makeRange(3000, 3100) });
      store.setOption('api.port', availablePort);
    }

    container.listen();

    window.once('ready-to-show', () => {
      window.show();
      isDev && window.webContents.openDevTools();
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
