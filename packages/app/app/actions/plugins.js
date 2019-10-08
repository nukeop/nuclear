import fs from 'fs';

import { store } from '../persistence/store';
import UserPlugin from '../structs/userPlugin';
import { error } from './toasts';

export const CREATE_PLUGINS = 'CREATE_PLUGINS';
export const SELECT_STREAM_PROVIDER = 'SELECT_STREAM_PROVIDER';
export const SELECT_LYRICS_PROVIDER = 'SELECT_LYRICS_PROVIDER';
export const SELECT_META_PROVIDER = 'SELECT_META_PROVIDER';

export const LOAD_USER_PLUGIN_START = 'LOAD_USER_PLUGIN_START';
export const LOAD_USER_PLUGIN_OK = 'LOAD_USER_PLUGIN_OK';
export const LOAD_USER_PLUGIN_ERROR = 'LOAD_USER_PLUGIN_ERROR';

export const SERIALIZE_PLUGINS = 'SERIALIZE_PLUGINS';
export const DESERIALIZE_PLUGINS = 'DESERIALIZE_PLUGINS';

export function createPlugins (pluginClasses) {
  let plugins = {};

  for (let i = 0; i < Object.keys(pluginClasses).length; i++) {
    let category = Object.keys(pluginClasses)[i];

    if (typeof plugins[category] === 'undefined') {
      plugins[category] = [];
    }

    for (let j = 0; j < Object.keys(pluginClasses[category]).length; j++) {
      let pluginName = Object.keys(pluginClasses[category])[j];
      let plugin = new pluginClasses[category][pluginName]();
      plugins[category].push(plugin);
    }
  }

  const categories = Object.keys(pluginClasses);
  let selected = {};
  _.forEach(categories, category => {
    selected[category] = _.head(plugins[category]).sourceName;
  });

  return {
    type: CREATE_PLUGINS,
    payload: {
      plugins,
      selected
    }
  };
}

export function selectMetaProvider (metaProvider) {
  return {
    type: SELECT_META_PROVIDER,
    payload: metaProvider
  };
}

export function selectStreamProvider (streamProvider) {
  return {
    type: SELECT_STREAM_PROVIDER,
    payload: streamProvider
  };
}

export function selectLyricsProvider(lyricsProvider) {
  return {
    type: SELECT_LYRICS_PROVIDER,
    payload: lyricsProvider
  };
}

function loadUserPluginStart(path) {
  return {
    type: LOAD_USER_PLUGIN_START,
    payload: { path }
  };
}

function loadUserPluginOk(plugin, path) {
  return {
    type: LOAD_USER_PLUGIN_OK,
    payload: { plugin, path }
  };
}

function loadUserPluginError(path, error) {
  return {
    type: LOAD_USER_PLUGIN_ERROR,
    payload: { path, error }
  };
}

export function loadUserPlugin(path, api) {
  return async dispatch => {
    dispatch(loadUserPluginStart(path));
    try {
      const pluginContents = await fs.promises.readFile(path, 'utf8');
      const plugin = eval(pluginContents);
      if (_.isNil(plugin)) {
        throw new Error('Invalid plugin file');
      }

      const pluginStruct = new UserPlugin(
        path,
        plugin.name,
        plugin.description,
        plugin.image,
        plugin.onLoad
      );

      if (_.isNil(pluginStruct.name)) {
        throw new Error('Unnamed plugins are not allowed');
      }

      pluginStruct.onLoad(api);
      dispatch(loadUserPluginOk(pluginStruct, path));
    } catch (err) {
      dispatch(error('Could not load plugin', `The plugin at ${path} is invalid`));
      dispatch(loadUserPluginError(path, err));
    }
  };
}

export function serializePlugins(plugins) {
  return dispatch => {
    store.set('plugins', plugins);
    dispatch({
      type: SERIALIZE_PLUGINS
    });
  };
}

export function deserializePlugins() {
  return dispatch => {
    const plugins = store.get('plugins') || [];
    dispatch({
      type: DESERIALIZE_PLUGINS,
      payload: { plugins }
    });
  };
}
