import {
  CREATE_PLUGINS,
  UNIFIED_SEARCH_START,
  UNIFIED_SEARCH_SUCCESS,
  UNIFIED_SEARCH_ERROR,
  ARTIST_SEARCH_SUCCESS,
  ALBUM_SEARCH_SUCCESS,

  ALBUM_INFO_SEARCH_START,
  ALBUM_INFO_SEARCH_SUCCESS,

  ARTIST_INFO_SEARCH_START,
  ARTIST_INFO_SEARCH_SUCCESS,

  ARTIST_RELEASES_SEARCH_START,
  ARTIST_RELEASES_SEARCH_SUCCESS
 } from '../actions';
import config from '../plugins/config';

var _ = require('lodash');

const initialState = {
  plugins: [],
  artistSearchResults: [],
  albumSearchResults: [],
  albumDetails: {},
  artistDetails: {},
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
        albumDetails: Object.assign({}, state.albumDetails, {
          [`${action.payload}`]: Object.assign(
            {},
            {loading: true}
          )
        })
      });
    case ALBUM_INFO_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        albumDetails: Object.assign({}, state.albumDetails, {
          [`${action.payload.id}`]: Object.assign(
            {},
            action.payload.info,
            {loading: false}
          )
        })
      });
    case ARTIST_INFO_SEARCH_START:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload}`]: {
            loading: true
          }
        })
      });
    case ARTIST_INFO_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload.id}`]: Object.assign(
            {},
            action.payload.info,
            {loading: false}
          )
        })
      });
    case ARTIST_RELEASES_SEARCH_START:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload}`]: Object.assign(
            {},
            state.artistDetails[`${action.payload}`],
          {releases: []}
          )
        })
      });
    case ARTIST_RELEASES_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload.id}`]: Object.assign(
            {},
            state.artistDetails[`${action.payload.id}`],
          {releases: action.payload.releases.releases}
          )
        })
      });
    default:
      return state;
  }
}
