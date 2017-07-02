import {
  CREATE_PLUGINS,
  UNIFIED_SEARCH,
  UNIFIED_SEARCH_START
 } from '../actions';
import config from '../plugins/config';

var _ = require('lodash');

const initialState = {
  plugins: [],
  search: {
    unifiedSearchResults: [],
    unifiedSearchStarted: false
  }

};

export default function SearchReducer(state=initialState, action) {
  switch (action.type) {
    case CREATE_PLUGINS:
    return Object.assign({}, state, {
      plugins: action.plugins
    });
    case UNIFIED_SEARCH_START:
    return Object.assign({}, state, {
      unifiedSearchStarted: true
    });
    case UNIFIED_SEARCH:
    return Object.assign({}, state, {
      unifiedSearchStarted: false,
      unifiedSearchResults: action.payload
    });
    default:
    return state;
  }
}
