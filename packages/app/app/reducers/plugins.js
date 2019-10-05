import {
  CREATE_PLUGINS,
  SELECT_DEFAULT_MUSIC_SOURCE,
  SELECT_DEFAULT_LYRICS_PROVIDER
} from '../actions/plugins';

const initialState = {
  plugins: [],
  selected: {}
};

export default function PluginsReducer(state=initialState, action) {
  switch (action.type) {
  case CREATE_PLUGINS:
    return {
      ...state,
      ...action.payload
    };
  case SELECT_DEFAULT_MUSIC_SOURCE:
    return {
      ...state,
      selected: {
        ...state.selected,
        streamProviders: action.payload
      }
    };
  case SELECT_DEFAULT_LYRICS_PROVIDER:
    return {
      ...state,
      selected: {
        ...state.selected,
        lyricsProviders: action.payload
      }
    };
  default:
    return state;
  }
}
