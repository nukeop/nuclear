import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import swagger from 'swagger-spec-express';

import { getSettingsSchema, updateSettingsSchema, RESTRICTED_SETTINGS } from '../schema';
import settingsParams from '../../../common/settings';
import { getStandardDescription } from '../swagger';

const { validate } = new Validator({ allErrors: true });

export function settingsRouter(store, rendererWindow) {

  const router = express.Router();

  swagger.swaggerize(router);

  router
    .get('/', (req, res) => {
      const settings = store.get('settings');
      const filteredSettings = settingsParams
        .filter(({ name }) => !RESTRICTED_SETTINGS.includes(name))
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
