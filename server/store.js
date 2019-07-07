import logger from 'electron-timber';
import electronStore from 'electron-store';
import _ from 'lodash';

import options from '../common/settings';

const store = new electronStore();
logger.log(`Initialized settings store at ${store.path}`);

function getOption(key) {
  let settings = store.get('settings') || {};
  let value = settings[key];
  if (typeof value === 'undefined') {
    value = _.find(options, { name: key }).default;
  }

  return value;
}

function setOption(key, value) {
  const settings = store.get('settings') || {};

  store.set('settings', Object.assign({}, settings, { [`${key}`]: value }));
}

export { getOption, setOption, store };
