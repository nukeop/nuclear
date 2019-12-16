/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain, Event } from 'electron';
import express from 'express';
import swagger, { ISwaggerizedRouter } from 'swagger-spec-express';

import { getStandardDescription } from '../swagger';

export function queueRouter(rendererWindow: Event['sender']): ISwaggerizedRouter {

  const router = express.Router() as ISwaggerizedRouter;
  
  swagger.swaggerize(router);

  router.get('/', (req, res) => {
    rendererWindow.send('queue');
    ipcMain.once('queue', (evt: Event, data: any) => {
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
