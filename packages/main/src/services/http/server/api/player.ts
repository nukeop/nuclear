import { NuclearStatus, IpcEvents } from '@nuclear/core';
import express from 'express';
import { ipcMain, Event, BrowserWindow } from 'electron';
import { Validator } from 'express-json-validator-middleware';
import swagger, { ISwaggerizedRouter } from 'swagger-spec-express';

import { volumeSchema, seekSchema } from '../schema';
import { getStandardDescription } from '../swagger';


const { validate } = new Validator({ allErrors: true });

export function playerRouter(rendererWindow: BrowserWindow['webContents']): ISwaggerizedRouter {

  const router = express.Router() as ISwaggerizedRouter;
  
  swagger.swaggerize(router);

  router
    .get('/now-playing', (req, res) => {
      rendererWindow.send(IpcEvents.PLAYING_STATUS);
      ipcMain.once(IpcEvents.PLAYING_STATUS, (evt: Event, data: NuclearStatus) => {
        res.json(data);
      });
    })
    .describe(
      getStandardDescription({
        successDescription: 'the status of nuclear player',
        tags: ['Player']
      })
    );

  router
    .post('/next', (req, res) => {
      rendererWindow.send(IpcEvents.NEXT);
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/previous', (req, res) => {
      rendererWindow.send(IpcEvents.PREVIOUS);
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/pause', (req, res) => {
      rendererWindow.send(IpcEvents.PAUSE);
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/play-pause', (req, res) => {
      rendererWindow.send(IpcEvents.PLAYPAUSE);
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/stop', (req, res) => {
      rendererWindow.send(IpcEvents.STOP);
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/play', (req, res) => {
      rendererWindow.send(IpcEvents.PLAY);
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/mute', (req, res) => {
      rendererWindow.send(IpcEvents.MUTE);
      res.send();
    })
    .describe(getStandardDescription({ tags: ['Player'] }));

  router
    .post('/volume', validate(volumeSchema), (req, res) => {
      rendererWindow.send(IpcEvents.VOLUME, req.body.value);
      res.send();
    })
    .describe(
      getStandardDescription({
        tags: ['Player'],
        body: ['volumeValue']
      })
    );

  router
    .post('/seek', validate(seekSchema), (req, res) => {
      rendererWindow.send(IpcEvents.SEEK, req.body.value);
      res.send();
    })
    .describe(
      getStandardDescription({
        tags: ['Player'],
        body: ['seekValue']
      })
    );
  
  return router;
}
