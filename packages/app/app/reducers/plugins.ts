import _ from 'lodash';
import { LyricsProvider, MetaProvider } from '@nuclear/core';
import { config } from '@nuclear/core/src/plugins/config';
import StreamProviderPlugin from '@nuclear/core/src/plugins/streamProvider';

import {
  CREATE_PLUGINS,
  SELECT_STREAM_PROVIDER,
  SELECT_LYRICS_PROVIDER,
  SELECT_META_PROVIDER,
  LOAD_USER_PLUGIN_START,
  LOAD_USER_PLUGIN_OK,
  LOAD_USER_PLUGIN_ERROR,
  DELETE_USER_PLUGIN
} from '../actions/plugins';

type UserPlugin = {
  path: string;
  name: string;
  description: string;
  image: string;
  author: string;
  loading?: boolean;
  error?: boolean;
}

type PluginKey = keyof typeof config.plugins;

export type PluginsState = {
  plugins: {
    streamProviders: StreamProviderPlugin[];
    metaProviders: MetaProvider[];
    lyricsProviders: LyricsProvider[];
  };
  selected: {
    [key in PluginKey]?: string;
  };
  userPlugins: Record<string, UserPlugin>;
}

const initialState: PluginsState = {
  plugins: {
    streamProviders: [],
    metaProviders: [],
    lyricsProviders: []
  },
  selected: {},
  userPlugins: {}
};

export default function PluginsReducer(state=initialState, action): PluginsState {
  switch (action.type) {
  case CREATE_PLUGINS:
    return {
      ...state,
      plugins: action.payload.plugins,
      selected: {
        ...action.payload.selected,
        ...state.selected
      } 
    };
  case SELECT_STREAM_PROVIDER:
    return {
      ...state,
      selected: {
        ...state.selected,
        streamProviders: action.payload
      }
    };
  case SELECT_LYRICS_PROVIDER:
    return {
      ...state,
      selected: {
        ...state.selected,
        lyricsProviders: action.payload
      }
    };
  case SELECT_META_PROVIDER:
    return {
      ...state,
      selected: {
        ...state.selected,
        metaProviders: action.payload
      }
    };
  case LOAD_USER_PLUGIN_START:
    return {
      ...state,
      userPlugins: {
        ...state.userPlugins,
        [action.payload.path]: {loading: true}
      }
    };
  case LOAD_USER_PLUGIN_OK:
    return {
      ...state,
      userPlugins: {
        ...state.userPlugins,
        [action.payload.path]: action.payload.plugin.toSerializable()
      }
    };
  case LOAD_USER_PLUGIN_ERROR:
    return {
      ...state,
      userPlugins: {
        ...state.userPlugins,
        [action.payload.path]: {
          path: action.payload.path,
          error: true
        }
      }
    };
  case DELETE_USER_PLUGIN:
    return {
      ...state,
      userPlugins: _.pickBy(state.userPlugins, (plugin: UserPlugin) => plugin.path !== action.payload.path)
    };
  default:
    return state;
  }
}
