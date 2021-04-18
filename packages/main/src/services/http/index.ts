import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import swagger from 'swagger-spec-express';

import Logger, { $httpApiLogger } from '../logger';
import Store from '../store';
import {
  windowRouter,
  playerRouter,
  settingsRouter,
  swaggerRouter,
  playlistRouter,
  queueRouter,
  equalizerRouter
} from './server/api';
import { errorMiddleware, notFoundMiddleware } from './server/middlewares';
import { initSwagger } from './server/swagger';
import Window from '../window';

const PREFIX = '/nuclear';

/**
 * Manage nuclear http-api
 * @see {@link https://github.com/expressjs/express}
 */
@injectable()
class HttpApi {
  app: Server;

  constructor(
    @inject($httpApiLogger) private logger: Logger,
    @inject(Store) private store: Store,
    @inject(Window) private window: Window
  ) { }

  /**
   * start the http api
   */
  listen(): Server {
    const port = this.store.getOption('api.port');
    const app = express();

    initSwagger(app);

    this.app = app
      .use(cors())
      .use(bodyParser.urlencoded({ extended: false }))
      .use(bodyParser.json())
      .use(`${PREFIX}/window`, windowRouter())
      .use(`${PREFIX}/player`, playerRouter(this.window.getBrowserWindow().webContents))
      .use(`${PREFIX}/settings`, settingsRouter(this.store, this.window.getBrowserWindow().webContents))
      .use(`${PREFIX}/docs`, swaggerRouter(this.store))
      .use(`${PREFIX}/playlist`, playlistRouter(this.store, this.window.getBrowserWindow().webContents))
      .use(`${PREFIX}/queue`, queueRouter(this.window.getBrowserWindow().webContents))
      .use(`${PREFIX}/equalizer`, equalizerRouter(this.store, this.window.getBrowserWindow().webContents))
      .use(notFoundMiddleware())
      .use(errorMiddleware(this.logger))
      .listen(port, '0.0.0.0', () => {
        swagger.compile();
        this.logger.log(`nuclear http api available on port ${port}`);
      });

    return this.app;
  }

  /**
   * close the http api
   */
  close(): Promise<void> {
    return new Promise(resolve => {
      if (this.app && this.app.listening) {
        this.app.close(() => resolve());
      } else {
        resolve();
      }
    });
  }
}

export default HttpApi;
