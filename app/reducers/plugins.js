import {
  CREATE_PLUGINS,
  REPLACE_PLUGINS
} from '../actions/plugins';

const initialState = {
  plugins: []
};

export default function PluginsReducer(state=initialState, action) {
  switch(action.type) {
    case CREATE_PLUGINS:
    return Object.assign({}, state, {
      plugins: action.payload
    });
    case REPLACE_PLUGINS:
    return Object.assign({}, {
      plugins: action.payload
    });
    default:
    return state;
  }
}
