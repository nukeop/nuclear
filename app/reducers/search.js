import {
  CREATE_PLUGINS,
  UNIFIED_SEARCH,
  createSearchPlugins
 } from '../actions';
import config from '../plugins/config';

const initialState = {
  searchPlugins: [],
  unifiedSearchResults: []
};

export default function SearchReducer(state=initialState, action) {
  switch (action.type) {
    case CREATE_PLUGINS:
    return Object.assign({}, state, {
      searchPlugins: action.plugins
    });
    case UNIFIED_SEARCH:
    return Object.assign({}, state, {
      unifiedSearchResults: action.payload
    });
    default:
    return state;
  }
}
