import {
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
  ARTIST_RELEASES_SEARCH_SUCCESS,
  LASTFM_ARTIST_INFO_SEARCH_START,
  LASTFM_ARTIST_INFO_SEARCH_SUCCESS,
  LASTFM_TRACK_SEARCH_START,
  LASTFM_TRACK_SEARCH_SUCCESS,
} from '../actions';

var _ = require('lodash');

const initialState = {
  plugins: [],
  artistSearchResults: [],
  albumSearchResults: [],
  trackSearchResults: [],
  albumDetails: {},
  artistDetails: {},
  unifiedSearchStarted: false,
};

export default function SearchReducer(state = initialState, action) {
  switch (action.type) {
    case UNIFIED_SEARCH_START:
      return Object.assign({}, state, {
        unifiedSearchStarted: action.payload,
      });
    case ALBUM_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        albumSearchResults: action.payload,
      });
    case ARTIST_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        artistSearchResults: action.payload,
      });
    case UNIFIED_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        unifiedSearchStarted: action.payload,
      });
    case ALBUM_INFO_SEARCH_START:
      return Object.assign({}, state, {
        albumDetails: Object.assign({}, state.albumDetails, {
          [`${action.payload}`]: Object.assign({}, { loading: true }),
        }),
      });
    case ALBUM_INFO_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        albumDetails: Object.assign({}, state.albumDetails, {
          [`${action.payload.id}`]: Object.assign({}, action.payload.info, {
            loading: false,
          }),
        }),
      });
    case ARTIST_INFO_SEARCH_START:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload}`]: {
            loading: true,
          },
        }),
      });
    case ARTIST_INFO_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload.id}`]: Object.assign({}, action.payload.info, {
            loading: false,
          }),
        }),
      });
    case ARTIST_RELEASES_SEARCH_START:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload}`]: Object.assign(
            {},
            state.artistDetails[`${action.payload}`],
            { releases: [] }
          ),
        }),
      });
    case ARTIST_RELEASES_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload.id}`]: Object.assign(
            {},
            state.artistDetails[`${action.payload.id}`],
            { releases: action.payload.releases.releases }
          ),
        }),
      });
    case LASTFM_ARTIST_INFO_SEARCH_START:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload}`]: Object.assign(
            {},
            state.artistDetails[`${action.payload}`],
            { lastfm: { loading: true } }
          ),
        }),
      });
    case LASTFM_ARTIST_INFO_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        artistDetails: Object.assign({}, state.artistDetails, {
          [`${action.payload.id}`]: Object.assign(
            {},
            state.artistDetails[`${action.payload.id}`],
            {
              lastfm: Object.assign({}, action.payload.info, {
                loading: false,
              }),
            }
          ),
        }),
      });
    case LASTFM_TRACK_SEARCH_START:
      return Object.assign({}, state, {
        trackSearchStarted: action.payload,
      });
    case LASTFM_TRACK_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        trackSearchResults: action.payload,
      });
    default:
      return state;
  }
}
