import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swagger from 'swagger-spec-express';

import {
  windowRouter,
  playerRouter,
  settingsRouter,
  swaggerRouter,
  playlistRouter,
  queueRouter,
  equalizerRouter,
  localFileRouter
} from '../http/api';
import { errorMiddleware, notFoundMiddleware } from '../http/middlewares';
import { initSwagger } from '../http/swagger';

const HOST = '0.0.0.0';
const PREFIX = '/nuclear';

/**
 * Manage nuclear http-api
 * @see {@link https://github.com/expressjs/express}
 */
class HttpApi {
  constructor({ localLibrary, httpLogger, store }) {
    /** @type {import('./localLibrary').default} */
    this.localLibrary = localLibrary;
    /** @type {import('./logger').Logger} */
    this.logger = httpLogger;
    /** @type {import('./store').default} */
    this.store = store;
  }

  /**
   * start the http api
   * @returns {import('express').Express}
   */
  listen() {
    const port = this.store.getOption('api.port');
    this.app = express();

    initSwagger(this.app);
  
    return this.app
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
      .listen(port, HOST, err => {
        if (err && this.logger) {
          this.logger.error('Something fail during http api initialisation');
          this.logger.error(err);
        } else {
          swagger.compile();
          this.logger && this.logger.log(`nuclear http api available on port ${port}`);
        }
      });
  }

  /**
   * close the http api
   * @returns {Promise}
   */
  close() {
    return new Promise(resolve => {
      if (this.app && this.app.listening) {
        this.app.close(resolve);
      } else {
        resolve();
      }
    });
  }
}

export default HttpApi;
