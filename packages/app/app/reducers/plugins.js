import {
  CREATE_PLUGINS,
  SELECT_STREAM_PROVIDER,
  SELECT_LYRICS_PROVIDER,
  SELECT_META_PROVIDER,
  LOAD_USER_PLUGIN_START,
  LOAD_USER_PLUGIN_OK,
  LOAD_USER_PLUGIN_ERROR
} from '../actions/plugins';

const initialState = {
  plugins: {},
  selected: {},
  userPlugins: {}
};

export default function PluginsReducer(state=initialState, action) {
  switch (action.type) {
  case CREATE_PLUGINS:
    return {
      ...state,
      ...action.payload
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
        metaProvider: action.payload
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
        [action.payload.path]: {error: true}
      }
    };
  default:
    return state;
  }
}
