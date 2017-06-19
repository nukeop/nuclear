import {
  CREATE_PLUGINS,
  UNIFIED_SEARCH,
  UNIFIED_SEARCH_START,
  ALBUM_INFO_SEARCH,
  ARTIST_INFO_SEARCH
 } from '../actions';
import config from '../plugins/config';

var _ = require('lodash');

const initialState = {
  searchPlugins: [],
  unifiedSearchResults: [],
  unifiedSearchStarted: false
};

export default function SearchReducer(state=initialState, action) {
  switch (action.type) {
    case CREATE_PLUGINS:
    return Object.assign({}, state, {
      searchPlugins: action.plugins
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
    case ARTIST_INFO_SEARCH:
    var toReplace = _.filter(
      state.unifiedSearchResults[0].results,
      {'id': action.payload.id}
    )[0];
    toReplace = Object.assign({}, toReplace, action.payload);
    var index = _.findIndex(
      state.unifiedSearchResults[0].results,
      {'id': action.payload.id}
    );
    var newSearchResults = Object.assign({}, state.unifiedSearchResults);
    newSearchResults[0].results[index] = toReplace;

    return Object.assign({}, state, {
      unifiedSearchResults: newSearchResults
    });
    case ALBUM_INFO_SEARCH:
    var toReplace = _.filter(
      state.unifiedSearchResults[1].results,
      {'id': action.payload.id}
    )[0];
    toReplace = Object.assign({}, toReplace, action.payload);
    var index = _.findIndex(
      state.unifiedSearchResults[1].results,
      {'id': action.payload.id}
    );
    var newSearchResults = Object.assign({}, state.unifiedSearchResults);
    newSearchResults[1].results[index] = toReplace;

    return Object.assign({}, state, {
      unifiedSearchResults: newSearchResults
    });
    return state;
    default:
    return state;
  }
}
