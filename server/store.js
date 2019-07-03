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

function setLocalMeta(data) {
  const meta = Object.values(data)
    .map(item => ({
      ...item,
      cover: item.cover ? item.cover.toString('base64') : undefined
    }))
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.uuid]: item
      }),
      {}
    );

  store.set('localMeta', meta);
}

function getLocalMeta() {
  const data = store.get('localMeta');

  return Object.values(data)
    .map(item => ({
      ...item,
      cover: item.cover ? Buffer.from(item.cover, 'base64') : undefined
    }))
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.uuid]: item
      }),
      {}
    );
}

export { getOption, setOption, setLocalMeta, getLocalMeta, store };
