import Logger from 'electron-timber';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { windowRouter, playerRouter, settingsRouter } from './api';
import { errorMiddleware, notFoundMiddleware } from './middlewares';

function runHttpServer({
  log,
  port = 3000,
  host = '0.0.0.0',
  prefix = '/nuclear'
}) {
  const app = express();
  const logger = log
    ? Logger.create({ name: 'http api' })
    : { log: () => {}, error: () => {} };

  return app
    .use(cors())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(`${prefix}/window`, windowRouter())
    .use(`${prefix}/player`, playerRouter())
    .use(`${prefix}/settings`, settingsRouter())
    .use(notFoundMiddleware())
    .use(errorMiddleware(logger))
    .listen(port, host, err => {
      if (err) {
        logger.error(err);
      } else {
        logger.log(`nuclear api available on port ${port}`);
      }
    });
}

module.exports = runHttpServer;
