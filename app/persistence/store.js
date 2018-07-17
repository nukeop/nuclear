let { app } = require('electron').remote;
import electronStore from 'electron-store';
import options from '../constants/settings';

const store = new electronStore();
initStore();

function initStore() {
  if(!store.get('lastFm')){
    store.set('lastFm', {});
  }

  if(!store.get('settings')){
    store.set('settings', {});
  }

  if(!store.get('playlists')){
    store.set('playlists', {});
  }
}

function getOption(key) {
  let settings = store.get('settings') || {};
  let value = settings[key];
  if (value === undefined) {
    value =  _.find(options, { name: key }).default;
  }
  
  return value;
}

function setOption(key, value) {
  let settings = store.get('settings') || {};
  store.set(
    'settings',
    Object.assign({}, settings, {[`${key}`]: value})
  );
}

export { store, getOption, setOption };
