import {
  CREATE_PLUGINS,
  SELECT_DEFAULT_MUSIC_SOURCE
} from '../actions/plugins';

const initialState = {
  plugins: [],
  defaultMusicSource: null
};

export default function PluginsReducer(state=initialState, action) {
  switch (action.type) {
  case CREATE_PLUGINS:
    return Object.assign({}, state, {
      plugins: action.payload
    });
  case SELECT_DEFAULT_MUSIC_SOURCE:
    return Object.assign({}, state, {
      defaultMusicSource: action.payload
    });
  default:
    return state;
  }
}
