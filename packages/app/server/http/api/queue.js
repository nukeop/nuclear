import { ipcMain } from 'electron';
import express from 'express';
import swagger from 'swagger-spec-express';

import { getStandardDescription } from '../swagger';

export function queueRouter(rendererWindow) {

  const router = express.Router();
  
  swagger.swaggerize(router);

  router.get('/', (req, res) => {
    rendererWindow.send('queue');
    ipcMain.once('queue', (evt, data) => {
      res.json(data);
    });
  })
    .describe(getStandardDescription({
      successDescription: 'The current queue',
      tags: ['Queue']
    }));

  router
    .post('/empty', (req, res) => {
      rendererWindow.send('empty-queue');
      res.send();
    })
    .describe(getStandardDescription({
      successDescription: 'The queue is now empty',
      tags: ['Queue']
    }));
  
  return router;
}
