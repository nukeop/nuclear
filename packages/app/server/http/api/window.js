import express from 'express';
const { ipcMain } = require('electron');
import swagger from 'swagger-spec-express';
import { getStandardDescription } from '../swagger';

export function windowRouter() {

  const router = express.Router();

  swagger.swaggerize(router);

  router
    .post('/quit', (req, res) => {
      ipcMain.emit('close');
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Window'] }));

  router
    .post('/maximize', (req, res) => {
      ipcMain.emit('maximize');
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Window'] }));

  router
    .post('/minimize', (req, res) => {
      ipcMain.emit('minimize');
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Window'] }));

  return router;
}

