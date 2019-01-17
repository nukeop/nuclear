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

function reduceUnifiedSearchStart(state, action) {
  return Object.assign({}, state, {
    unifiedSearchStarted: action.payload,
  });
}
function reduceAlbumSearchSuccess(state, action) {
  return Object.assign({}, state, {
    albumSearchResults: action.payload,
  });
}

function reduceArtistSearchSuccess(state, action) {
  return Object.assign({}, state, {
    artistSearchResults: action.payload,
  });
}

function reduceUnifiedSearchSuccess(state, action) {
  return Object.assign({}, state, {
    unifiedSearchStarted: action.payload,
  });
}

function reduceAlbumInfoSearchStart(state, action) {
  return Object.assign({}, state, {
    albumDetails: Object.assign({}, state.albumDetails, {
      [`${action.payload}`]: Object.assign({}, { loading: true }),
    }),
  });
}

function reduceAlbumInfoSearchSuccess(state, action) {
  return Object.assign({}, state, {
    albumDetails: Object.assign({}, state.albumDetails, {
      [`${action.payload.id}`]: Object.assign({}, action.payload.info, {
        loading: false,
      }),
    }),
  });
}

function reduceArtistInfoSearchStart(state, action) {
  return Object.assign({}, state, {
    artistDetails: Object.assign({}, state.artistDetails, {
      [`${action.payload}`]: {
        loading: true,
      },
    }),
  });
}

function reduceArtistInfoSearchSuccess(state, action) {
  return Object.assign({}, state, {
    artistDetails: Object.assign({}, state.artistDetails, {
      [`${action.payload.id}`]: Object.assign({}, action.payload.info, {
        loading: false,
      }),
    }),
  });
}
function reduceArtistReleasesSearchStart(state, action) {
  return Object.assign({}, state, {
    artistDetails: Object.assign({}, state.artistDetails, {
      [`${action.payload}`]: Object.assign(
        {},
        state.artistDetails[`${action.payload}`],
        { releases: [] }
      ),
    }),
  });
}

function reduceArtistReleasesSearchSuccess(state, action) {
  return Object.assign({}, state, {
    artistDetails: Object.assign({}, state.artistDetails, {
      [`${action.payload.id}`]: Object.assign(
        {},
        state.artistDetails[`${action.payload.id}`],
        { releases: action.payload.releases.releases }
      ),
    }),
  });
}

function reduceLastfmArtistInfoSearchStart(state, action) {
  return Object.assign({}, state, {
    artistDetails: Object.assign({}, state.artistDetails, {
      [`${action.payload}`]: Object.assign(
        {},
        state.artistDetails[`${action.payload}`],
        { lastfm: { loading: true } }
      ),
    }),
  });
}

function reduceLastfmArtistInfoSearchSuccess(state, action) {
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
}

function reduceLastfmTrackSearchStart(state, action) {
  return Object.assign({}, state, {
    trackSearchStarted: action.payload,
  });
}

function reduceLastfmTrackSearchSuccess(state, action) {
  return Object.assign({}, state, {
    trackSearchResults: action.payload,
  });
}

export default function SearchReducer(state = initialState, action) {
  switch (action.type) {
    case UNIFIED_SEARCH_START:
      return reduceUnifiedSearchStart(state, action);
    case ALBUM_SEARCH_SUCCESS:
      return reduceAlbumSearchSuccess(state, action);
    case ARTIST_SEARCH_SUCCESS:
      return reduceArtistSearchSuccess(state, action);
    case UNIFIED_SEARCH_SUCCESS:
      return reduceUnifiedSearchSuccess(state, action);
    case ALBUM_INFO_SEARCH_START:
      return reduceAlbumInfoSearchStart(state, action);
    case ALBUM_INFO_SEARCH_SUCCESS:
      return reduceAlbumInfoSearchSuccess(state, action);
    case ARTIST_INFO_SEARCH_START:
      return reduceArtistInfoSearchStart(state, action);
    case ARTIST_INFO_SEARCH_SUCCESS:
      return reduceArtistInfoSearchSuccess(state, action);
    case ARTIST_RELEASES_SEARCH_START:
      return reduceArtistReleasesSearchStart(state, action);
    case ARTIST_RELEASES_SEARCH_SUCCESS:
      return reduceArtistReleasesSearchSuccess(state, action);
    case LASTFM_ARTIST_INFO_SEARCH_START:
      return reduceLastfmArtistInfoSearchStart(state, action);
    case LASTFM_ARTIST_INFO_SEARCH_SUCCESS:
      return reduceLastfmArtistInfoSearchSuccess(state, action);
    case LASTFM_TRACK_SEARCH_START:
      return reduceLastfmTrackSearchStart(state, action);
    case LASTFM_TRACK_SEARCH_SUCCESS:
      return reduceLastfmTrackSearchSuccess(state, action);
    default:
      return state;
  }
}
