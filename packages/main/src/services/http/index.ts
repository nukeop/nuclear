import bodyParser from 'body-parser';
import cors from 'cors';
import { Event } from 'electron';
import express from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import swagger from 'swagger-spec-express';

import LocalLibrary from '../local-library';
import Logger, { httpApiLogger } from '../logger';
import Store from '../store';
import {
  windowRouter,
  playerRouter,
  settingsRouter,
  swaggerRouter,
  playlistRouter,
  queueRouter,
  equalizerRouter,
  localFileRouter
} from './server/api';
import { errorMiddleware, notFoundMiddleware } from './server/middlewares';
import { initSwagger } from './server/swagger';

const PREFIX = '/nuclear';

/**
 * Manage nuclear http-api
 * @see {@link https://github.com/expressjs/express}
 */
@injectable()
class HttpApi {
  app: Server;
  rendererWindow: Event['sender'];

  constructor(
    @inject(LocalLibrary) private localLibrary: LocalLibrary,
    @inject(httpApiLogger) private logger: Logger,
    @inject(Store) private store: Store
  ){}

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
      .use(`${PREFIX}/player`, playerRouter(this.rendererWindow))
      .use(`${PREFIX}/settings`, settingsRouter(this.store, this.rendererWindow))
      .use(`${PREFIX}/docs`, swaggerRouter(this.store))
      .use(`${PREFIX}/playlist`, playlistRouter(this.store, this.rendererWindow))
      .use(`${PREFIX}/file`, localFileRouter(this.localLibrary, this.store))
      .use(`${PREFIX}/queue`, queueRouter(this.rendererWindow))
      .use(`${PREFIX}/equalizer`, equalizerRouter(this.store, this.rendererWindow))
      .use(notFoundMiddleware())
      .use(errorMiddleware(this.logger))
      .listen(port, '0.0.0.0', err => {
        if (err) {
          this.logger.error('Something fail during http api initialisation');
          this.logger.error(err);
        } else {
          swagger.compile();
          this.logger.log(`nuclear http api available on port ${port}`);
        }
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
