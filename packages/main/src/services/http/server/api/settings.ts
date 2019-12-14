import { settingsConfig } from '@nuclear/common';
import { Event } from 'electron';
import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import swagger, { ISwaggerizedRouter } from 'swagger-spec-express';

import { getSettingsSchema, updateSettingsSchema, RESTRICTED_SETTINGS } from '../schema';
import { getStandardDescription } from '../swagger';
import Store from '../../../store';

const { validate } = new Validator({ allErrors: true });

export function settingsRouter(store: Store, rendererWindow: Event['sender']): ISwaggerizedRouter {

  const router = express.Router() as ISwaggerizedRouter;

  swagger.swaggerize(router);

  router
    .get('/', (req, res) => {
      const settings = store.get('settings');
      const filteredSettings = settingsConfig
        .filter(({ name }) => !RESTRICTED_SETTINGS.includes(name as never))
        .reduce((acc, item) => ({
          ...acc,
          [item.name]: settings[item.name] || item.default
        }), {});

      
      res.json(filteredSettings);
    })
    .describe(
      getStandardDescription({
        tags: ['Settings'],
        successDescription: 'nuclear\'s settings'
      })
    );

  router
    .get(
      '/:option',
      validate(getSettingsSchema),
      (req, res) => {
        res.send(store.getOption(req.params.option));
      }
    )
    .describe(
      getStandardDescription({
        tags: ['Settings'],
        path: ['option']
      })
    );

  router
    .post(
      '/:option',
      validate(updateSettingsSchema),
      (req, res) => {
        rendererWindow.send('settings', { [req.params.option]: req.body.value });
        res.send();
      }
    )
    .describe(
      getStandardDescription({
        tags: ['Settings'],
        path: ['option'],
        body: ['settingsValue']
      })
    );
  
  return router;
}
