import _ from 'lodash';
import electronStore from 'electron-store';

import options from '../constants/settings';
import { restartApi, stopApi } from '../mpris';

const store = new electronStore();

function initStore () {
  if (!store.get('lastFm')) {
    store.set('lastFm', {});
  }

  if (!store.get('settings')) {
    store.set('settings', {});
  }

  if (!store.get('playlists')) {
    store.set('playlists', []);
  }

  if (!store.get('favorites')) {
    store.set('favorites', {
      tracks: [],
      artists: [],
      albums: []
    });
  }

  if (!store.get('equalizer')) {
    store.set('equalizer', {
      selected: 'default',
      presets: {
        default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Rock&Roll': [4, 6, -7, -8, 4, 3, 0, 5, 7, 10],
        'Hip-Hop': [-6, 5, 1, 7, -8, 10, 9, 6, 0, 5],
        'Soul': [3, 4, 5, 6, 7, 8, 9, 10, 1, 2],
        'Classic': [1, 2, 3, 4, 5, 6, -10, -9, -8, -7]
      }
    });
  }
}

initStore();

function getOption (key) {
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

function setOption (key, value) {
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
