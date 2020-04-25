/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcEvents } from '@nuclear/core';
import { ipcMain, Event, BrowserWindow } from 'electron';
import express from 'express';
import swagger, { ISwaggerizedRouter } from 'swagger-spec-express';

import { getStandardDescription } from '../swagger';

export function queueRouter(rendererWindow: BrowserWindow['webContents']): ISwaggerizedRouter {

  const router = express.Router() as ISwaggerizedRouter;
  
  swagger.swaggerize(router);

  router.get('/', (req, res) => {
    rendererWindow.send(IpcEvents.QUEUE);
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
      rendererWindow.send(IpcEvents.QUEUE_CLEAR);
      res.send();
    })
    .describe(getStandardDescription({
      successDescription: 'The queue is now empty',
      tags: ['Queue']
    }));
  
  return router;
}
