import _ from 'lodash';
import ElectronStore from 'electron-store';

import { rendererSettings } from '../settings/renderer';

type SettingsStore = {
  [key: string]: unknown;
}

const store = new ElectronStore();

function setIfUnset(key: string, value: unknown) {
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

  setIfUnset('equalizer', {
    selected: 'Default'
  });
}

// Should be called in startup process
initStore();

function getOption(key: string): unknown {
  const settings = (store.get('settings') as SettingsStore) || {};
  let value = settings[key];

  if (typeof value === 'undefined') {
    value = _.find(rendererSettings, { name: key }).default;
  }

  return value;
}

function setOption(key: string, value: unknown) {
  const settings = (store.get('settings') as SettingsStore) || {};
  
  store.set('settings', { ...settings, [key]: value });
}

export { store, getOption, setOption };
