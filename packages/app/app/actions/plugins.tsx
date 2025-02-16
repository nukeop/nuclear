import fs from 'fs';
import { logger } from '@nuclear/core';
import { store } from '@nuclear/core';

import UserPlugin from '../structs/userPlugin';
import { error } from './toasts';
import { createApi } from '@nuclear/core';
import { find, forEach, isNil } from 'lodash';
import { PluginsState } from '../reducers/plugins';

export const CREATE_PLUGINS = 'CREATE_PLUGINS';
export const SELECT_STREAM_PROVIDER = 'SELECT_STREAM_PROVIDER';
export const SELECT_LYRICS_PROVIDER = 'SELECT_LYRICS_PROVIDER';
export const SELECT_META_PROVIDER = 'SELECT_META_PROVIDER';

export const LOAD_USER_PLUGIN_START = 'LOAD_USER_PLUGIN_START';
export const LOAD_USER_PLUGIN_OK = 'LOAD_USER_PLUGIN_OK';
export const LOAD_USER_PLUGIN_ERROR = 'LOAD_USER_PLUGIN_ERROR';

export const DELETE_USER_PLUGIN = 'DELETE_USER_PLUGIN';

export const SERIALIZE_PLUGINS = 'SERIALIZE_PLUGINS';
export const DESERIALIZE_PLUGINS = 'DESERIALIZE_PLUGINS';

export function createPlugins (pluginClasses) {
  const plugins = {};

  for (let i = 0; i < Object.keys(pluginClasses).length; i++) {
    const category = Object.keys(pluginClasses)[i];

    if (typeof plugins[category] === 'undefined') {
      plugins[category] = [];
    }

    for (let j = 0; j < Object.keys(pluginClasses[category]).length; j++) {
      const pluginName = Object.keys(pluginClasses[category])[j];
      const plugin = new pluginClasses[category][pluginName]();
      plugins[category].push(plugin);
    }
  }

  const categories = Object.keys(pluginClasses);
  const selected = {};
  forEach(categories, category => {
    const selectedForCategory = find(plugins[category], { isDefault: true });
    selected[category] = selectedForCategory.sourceName;
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

export function loadUserPlugin(path) {
  return async (dispatch, getState) => {
    dispatch(loadUserPluginStart(path));
    try {
      const api = createApi();
      const transformedPluginContents = {code: ''};

      const plugin = eval(transformedPluginContents.code);

      if (isNil(plugin)) {
        throw new Error('Invalid plugin file');
      }

      const pluginStruct = new UserPlugin(
        path,
        plugin.name,
        plugin.description,
        plugin.image,
        plugin.author,
        plugin.onLoad
      );

      if (isNil(pluginStruct.name)) {
        throw new Error('Unnamed plugins are not allowed');
      }

      pluginStruct.onLoad(api);
      dispatch(loadUserPluginOk(pluginStruct, path));

      const userPlugins = getState().plugin.userPlugins;
      dispatch(serializePlugins(userPlugins));
    } catch (err) {
      logger.error(err);
      dispatch(error('Could not load plugin', `The plugin at ${path} is invalid`));
      dispatch(loadUserPluginError(path, err));
    }
  };
}

export function deleteUserPluginAction(path) {
  return {
    type: DELETE_USER_PLUGIN,
    payload: { path }
  };
}

export function deleteUserPlugin(path) {
  return async (dispatch, getState) => {
    await dispatch(deleteUserPluginAction(path));
    const userPlugins = getState().plugin.userPlugins;
    dispatch(serializePlugins(userPlugins));
  };
}

export function serializePlugins(plugins) {
  return () => {
    store.set('plugins', plugins);
  };
}

export function deserializePlugins() {
  return dispatch => {
    const plugins = (store.get('plugins') || []) as PluginsState['userPlugins'];
    forEach(plugins, plugin => {
      dispatch(loadUserPlugin(plugin.path));
    });
  };
}
