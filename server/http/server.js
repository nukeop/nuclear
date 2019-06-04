import Logger from 'electron-timber';
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
} from './api';
import { errorMiddleware, notFoundMiddleware } from './middlewares';
import { initSwagger } from './swagger';

function runHttpServer({
  log,
  port,
  host = '0.0.0.0',
  prefix = '/nuclear'
}) {
  const app = express();
  const logger = log
    ? Logger.create({ name: 'http api' })
    : { log: () => {}, error: () => {} };

  initSwagger(app);

  return app
    .use(cors())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(`${prefix}/window`, windowRouter())
    .use(`${prefix}/player`, playerRouter())
    .use(`${prefix}/settings`, settingsRouter())
    .use(`${prefix}/docs`, swaggerRouter())
    .use(`${prefix}/playlist`, playlistRouter())
    .use(`${prefix}/queue`, queueRouter())
    .use(`${prefix}/equalizer`, equalizerRouter())
    .use(`${prefix}/file`, localFileRouter())
    .use(notFoundMiddleware())
    .use(errorMiddleware(logger))
    .listen(port, host, err => {
      if (err) {
        logger.error(err);
      } else {
        swagger.compile();
        logger.log(`nuclear api available on port ${port}`);
      }
    });
}

function closeHttpServer(app) {
  return new Promise(resolve => {
    if (app && app.listening) {
      app.close(resolve);
    } else {
      resolve();
    }
  });
}

module.exports = { runHttpServer, closeHttpServer };
