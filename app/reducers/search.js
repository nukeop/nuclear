import {
  CREATE_PLUGINS,
  UNIFIED_SEARCH_START,
  UNIFIED_SEARCH_SUCCESS,
  UNIFIED_SEARCH_ERROR,
  ARTIST_SEARCH_SUCCESS,
  ALBUM_SEARCH_SUCCESS,

  ALBUM_INFO_SEARCH_START,
  ALBUM_INFO_SEARCH_SUCCESS
 } from '../actions';
import config from '../plugins/config';

var _ = require('lodash');

const initialState = {
  plugins: [],
  artistSearchResults: [],
  albumSearchResults: [],
  albumDetails: {},
  unifiedSearchStarted: false
};

export default function SearchReducer(state=initialState, action) {
  switch (action.type) {
    case CREATE_PLUGINS:
      return Object.assign({}, state, {
        plugins: action.payload
      });
    case UNIFIED_SEARCH_START:
      return Object.assign({}, state, {
        unifiedSearchStarted: action.payload
      });
    case ALBUM_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        albumSearchResults: action.payload
      });
    case ARTIST_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        artistSearchResults: action.payload
      });
    case UNIFIED_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        unifiedSearchStarted: action.payload
      });
    case ALBUM_INFO_SEARCH_START:
      return Object.assign({}, state, {
        albumDetails: {
          [`${action.payload}`]: {
            loading: true
          }
        }
      });
    case ALBUM_INFO_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        albumDetails: {
          [`${action.payload.id}`]: Object.assign(
            {},
            action.payload.info,
            {loading: false}
          )
        }
      });
      return state;
    default:
      return state;
  }
}
