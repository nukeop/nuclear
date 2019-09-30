import _ from 'lodash';
import electronStore from 'electron-store';

import options from '../../common/settings';
import { restartApi, stopApi } from '../mpris';

const store = new electronStore();

function setIfUnset(key, value) {
  if (!store.get(key)) {
    store.set(key, value);
  }
}

function initStore() {
  setIfUnset('lastFm', {});
  setIfUnset('settings', {});
  setIfUnset('localMeta', {});

  setIfUnset('localFolders', []);
  setIfUnset('playLists', []);

  setIfUnset('favorites', {
    tracks: [],
    artists: [],
    albums: []
  });

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
    value = _.find(options, { name: key }).default;
  }

  return value;
}

function isValidPort(value) {
  return typeof value === 'number' && value > 1024 && value < 49151;
}

function setOption(key, value) {
  const settings = store.get('settings') || {};

  store.set('settings', Object.assign({}, settings, { [`${key}`]: value }));

  if (
    (key === 'api.port' && isValidPort(value) && getOption('api.enabled')) ||
    (key === 'api.enabled' && value)
  ) {
    restartApi();
  } else if (key === 'api.enabled' && !value) {
    stopApi();
  }
}

export { store, getOption, setOption };
