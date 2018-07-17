import { app } from 'electron';
import logger from 'electron-timber';
import electronStore from 'electron-store';
import _ from'lodash';

import options from '../app/constants/settings';
const store = new electronStore();
logger.log(`Initialized settings store at ${store.path}`);

function getOption(key) {
  let settings = store.get('settings') || {};
  let value = settings[key];
  if (value === undefined) {
    value =  _.find(options, { name: key }).default;
  }
  
  return value;
}

export { getOption };
