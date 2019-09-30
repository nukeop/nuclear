import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import swagger from 'swagger-spec-express';

import { store } from '../../store';
import { onUpdateEqualizer, onSetEqualizer } from '../../mpris';
import { updateEqualizerSchema } from '../schema';
import { getStandardDescription } from '../swagger';

const { validate } = new Validator({ allErrors: true });

export function equalizerRouter() {
  const router = express.Router();

  swagger.swaggerize(router);

  router.get('/', (req, res) => {
    res.json(store.get('equalizer'));
  })
    .describe(getStandardDescription({
      successDescription: 'the selected equalizer and the presets',
      tags: ['Equalizer']
    }));

  router.post('/', validate(updateEqualizerSchema), (req, res) => {
    onUpdateEqualizer(req.body.values);
    res.send();
  })
    .describe(getStandardDescription({
      tags: ['Equalizer'],
      body: ['eqValues']
    }));

  router.post('/:eqName/set', (req, res) => {
    const equalizerNames = Object.keys(store.get('equalizer').presets);

    if (!equalizerNames.includes(req.params.eqName)) {
      res.status('400').send(`name should be one of ${equalizerNames.toString()}`);
    } else {
      onSetEqualizer(req.params.eqName);
      res.send();
    }
  })
    .describe(getStandardDescription({
      tags: ['Equalizer'],
      path: ['eqName']
    }));

  return router;
}
