import _ from 'lodash';
import ElectronStore from 'electron-store';

import { settingsConfig } from '../settings';

const store = new ElectronStore();

function setIfUnset(key, value) {
  if (!store.get(key)) {
    store.set(key, value);
  }
}

function initStore() {
  setIfUnset('lastFm', {});
  setIfUnset('settings', {});
  setIfUnset('playLists', []);

  setIfUnset('favorites', {
    tracks: [],
    artists: [],
    albums: []
  });

  setIfUnset('downloads', []);

  setIfUnset('blacklist', []);

  setIfUnset('equalizer', {
    selected: 'Default'
  });
}

// Should be called in startup process
initStore();

function getOption(key) {
  const settings = store.get('settings') || {};
  let value = settings[key];

  if (typeof value === 'undefined') {
    value = _.find(settingsConfig, { name: key }).default;
  }

  return value;
}

function setOption(key, value) {
  const settings = store.get('settings') || {};

  store.set('settings', Object.assign({}, settings, { [`${key}`]: value }));
}

export { store, getOption, setOption };
