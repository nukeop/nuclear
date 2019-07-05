import _ from 'lodash';
import electronStore from 'electron-store';
import logger from 'electron-timber';

import options from '../../common/settings';
import { restartApi, stopApi } from '../mpris';

const store = new electronStore();

function setIfUnset (key, value) {
  if (!store.get(key)) {
    store.set(key, value);
  }
}

function initStore () {
  setIfUnset('lastFm', {});
  setIfUnset('settings', {});

  setIfUnset('localFolders', []);
  setIfUnset('playLists', []);

  setIfUnset( 'favorites', {
    tracks: [],
    artists: [],
    albums: []
  });

  setIfUnset('equalizer', {
    selected: 'Default',
    presets: {
      Default: {
        values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        preAmp: 0
      },
      Classical: {
        values: [0, 0, 0, 0, 0, 0, -4, -4, -4, -6],
        preAmp: 0
      },
      Club: {
        values: [0, 0, 2, 4, 4, 4, 2, 0, 0, 0],
        preAmp: 0
      },
      Pop: {
        values: [-1, 2, 3, 4, 3, 0, -1, -1, -1, -1],
        preAmp: 0
      },
      Reggae: {
        values: [0, 0, 0, -2, 0, 2, 2, 0, 0, 0],
        preAmp: 0
      },
      Rock: {
        values: [4, 3, -2, -3, -2, 2, 5, 6, 6, 6],
        preAmp: 0
      },
      'Full bass': {
        values: [6, 6, 6, 4, 0, -2, -4, -6, -6, -6],
        preAmp: 0
      },
      'Full trebble': {
        values: [-6, -6, -6, -2, 2, 6, 8, 8, 9, 9],
        preAmp: 0
      }
    }
  });
}

// Should be called in startup process
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
