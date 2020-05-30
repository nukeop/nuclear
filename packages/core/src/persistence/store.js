import _ from 'lodash';
import ElectronStore from 'electron-store';

import { settingsConfig } from '../settings';

/**
 * return multiple items from store
 * @param {String[]} items array of keys
 * @return {Object} key,value pair of items
 */
ElectronStore.prototype.getItems = function(items){
  items = Array.isArray(items)?items:[items];
  const data ={};
  for (const item of items){
    data[item] = this.get(item);
  }
  return data;
};

/**
 * sets multiple items
 * @param {Object} items key value pairs to set
 * @return {void}
 */
ElectronStore.prototype.setItems = function(items){
  const keys = Object.keys(items);
  for (const key of keys){
    this.set(key, items[key]);
  }
};

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
