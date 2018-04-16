import {
  CREATE_PLUGINS,
  SAVE_MUSIC_SOURCE_ORDER
} from '../actions/plugins';

const initialState = {
  plugins: [],
  musicSourceOrder: []
};

export default function PluginsReducer(state=initialState, action) {
  switch(action.type) {
    case CREATE_PLUGINS:
    return Object.assign({}, state, {
      plugins: action.payload
    });
    case SAVE_MUSIC_SOURCE_ORDER:
    return Object.assign({}, state, {
      musicSourceOrder: action.payload
    });
    default:
    return state;
  }
}
