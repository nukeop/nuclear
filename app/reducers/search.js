import {
  CREATE_PLUGINS,
  createSearchPlugins
 } from '../actions';
import config from '../plugins/config';

const initialState = {
  searchPlugins: []
};

export default function SearchReducer(state=initialState, action) {
  switch (action.type) {
    case CREATE_PLUGINS:

    return Object.assign({}, state, {
      searchPlugins: action.plugins
    });
    default:
    return state;
  }
}
