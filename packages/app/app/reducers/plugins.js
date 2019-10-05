import {
  CREATE_PLUGINS,
  SELECT_DEFAULT_MUSIC_SOURCE,
  SELECT_DEFAULT_LYRICS_PROVIDER
} from '../actions/plugins';

const initialState = {
  plugins: [],
  defaultMusicSource: null
};

export default function PluginsReducer(state=initialState, action) {
  switch (action.type) {
  case CREATE_PLUGINS:
    return {
      ...state,
      plugins: action.payload
    };
  case SELECT_DEFAULT_MUSIC_SOURCE:
    return {
      ...state,
      defaultMusicSource: action.payload
    };
  case SELECT_DEFAULT_LYRICS_PROVIDER:
    return {
      ...state,
      defaultLyricsProvider: action.payload
    };
  default:
    return state;
  }
}
