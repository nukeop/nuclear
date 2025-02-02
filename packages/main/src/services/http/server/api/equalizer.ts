import { BrowserWindow } from 'electron';
import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import swagger, { ISwaggerizedRouter } from 'swagger-spec-express';

import { updateEqualizerSchema } from '../schema';
import { getStandardDescription } from '../swagger';
import Store from '../../../store';
import { IpcEvents } from '@nuclear/core';

const { validate } = new Validator({ allErrors: true });

type Preset = {
  label: string
  id: string
  values: number[]
  preAmp: number
}

type EqualizerPresetList = {
  presets: {
    [id: string]: Preset;
  }
}

export function equalizerRouter(store: Store, rendererWindow: BrowserWindow['webContents']): ISwaggerizedRouter {
  const router = express.Router() as ISwaggerizedRouter;

  swagger.swaggerize(router);

  router.get('/', (req, res) => {
    res.json(store.get('equalizer'));
  })
    .describe(getStandardDescription({
      successDescription: 'the selected equalizer and the presets',
      tags: ['Equalizer']
    }));

  router.post('/', validate(updateEqualizerSchema), (req, res) => {
    rendererWindow.send(IpcEvents.EQUALIZER_UPDATE, req.body.values);
    res.send();
  })
    .describe(getStandardDescription({
      tags: ['Equalizer'],
      body: ['eqValues']
    }));

  router.post('/:eqName/set', (req, res) => {
    const equalizerNames = Object.keys((store.get('equalizer') as EqualizerPresetList).presets);

    if (!equalizerNames.includes(req.params.eqName)) {
      res.status(400).send(`name should be one of ${equalizerNames.toString()}`);
    } else {
      rendererWindow.send(IpcEvents.EQUALIZER_SET, req.params.eqName);
      res.send();
    }
  })
    .describe(getStandardDescription({
      tags: ['Equalizer'],
      path: ['eqName']
    }));

  return router;
}
