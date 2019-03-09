import express from 'express';
import { Validator } from 'express-json-validator-middleware';

import { onSettings } from '../../mpris';
import { getOption, store } from '../../store';
import { getSettingsSchema, updateSettingsSchema, RESTRICTED_SETTINGS } from './_schema';
import settingsParams from '../../../app/constants/settings';

const { validate } = new Validator({ allErrors: true });

export function settingsRouter() {

  const router = express.Router();

  router.get('/', (req, res) => {
    const settings = store.get('settings');
    const filteredSettings = settingsParams
      .filter(({ name }) => !RESTRICTED_SETTINGS.includes(name))
      .reduce((acc, item) => ({
        ...acc,
        [item.name]: settings[item.name] || item.default
      }), {});

    
    res.json(filteredSettings);
  });

  router
    .route('/:option')
    .get(
      validate(getSettingsSchema),
      (req, res) => {
        res.send(getOption(req.params.option));
      }
    )
    .post(
      validate(updateSettingsSchema),
      (req, res) => {
        onSettings({ [req.params.option]: req.body.value });
        res.send();
      }
    );
  
  return router;
}
