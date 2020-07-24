import {
  UNIFIED_SEARCH_START,
  UNIFIED_SEARCH_SUCCESS,
  ARTIST_SEARCH_SUCCESS,
  ALBUM_SEARCH_SUCCESS,
  ALBUM_INFO_SEARCH_START,
  ALBUM_INFO_SEARCH_SUCCESS,
  ARTIST_INFO_SEARCH_START,
  ARTIST_INFO_SEARCH_SUCCESS,
  ARTIST_INFO_SEARCH_ERROR,
  ARTIST_RELEASES_SEARCH_START,
  ARTIST_RELEASES_SEARCH_SUCCESS,
  ARTIST_RELEASES_SEARCH_ERROR,
  LASTFM_TRACK_SEARCH_START,
  LASTFM_TRACK_SEARCH_SUCCESS,
  YOUTUBE_PLAYLIST_SEARCH_START,
  YOUTUBE_PLAYLIST_SEARCH_SUCCESS,
  ALBUM_INFO_SEARCH_ERROR,
  SEARCH_DROPDOWN_DISPLAY_CHANGE
} from '../actions/search';
import { Artist } from '@nuclear/core';

const initialState = {
  plugins: [],
  artistSearchResults: [],
  albumSearchResults: [],
  trackSearchResults: [],
  playlistSearchResults: [],
  albumDetails: {},
  artistDetails: {},
  searchHistory: [],
  unifiedSearchStarted: false,
  playlistSearchStarted: false,
  isFocused: false
};

function reduceAlbumSearchSuccess(state, action) {
  return {
    ...state,
    albumSearchResults: action.payload
  };
}

function reduceArtistSearchSuccess(state, action) {
  return {
    ...state,
    artistSearchResults: action.payload.map(artist => Artist.fromSearchResultData(artist))
  };
}

function reduceLastfmTrackSearchStart(state, action) {
  return {
    ...state,
    trackSearchResults: action.payload
  };
}

function reduceLastfmTrackSearchSuccess(state, action) {
  return {
    ...state,
    trackSearchResults: action.payload
  };
}

function reduceYoutubePlaylistSearchStart(state, action) {
  return {
    ...state,
    playlistSearchStarted: action.payload,
    playlistSearchResults: []
  };
}

function reduceYoutubePlaylistSearchSuccess(state, action) {
  return {
    ...state,
    playlistSearchResults: action.payload
  };
}

function reduceSearchDropdownDisplay(state, action) {
  return {
    ...state,
    isFocused: action.payload
  };
}

export default function SearchReducer(state = initialState, action) {
  switch (action.type) {
  case UNIFIED_SEARCH_START:
    return {
      ...state,
      unifiedSearchStarted: true
    };
  case UNIFIED_SEARCH_SUCCESS:
    return {
      ...state,
      unifiedSearchStarted: false
    };
  case ALBUM_SEARCH_SUCCESS:
    return reduceAlbumSearchSuccess(state, action);
  case ARTIST_SEARCH_SUCCESS:
    return reduceArtistSearchSuccess(state, action);

  case ALBUM_INFO_SEARCH_START:
    return {
      ...state,
      albumDetails: {
        ...state.albumDetails,
        [`${action.payload.albumId}`]: { loading: true }
      }
    };
  case ALBUM_INFO_SEARCH_SUCCESS:
    return {
      ...state,
      albumDetails: {
        ...state.albumDetails,
        [action.payload.albumId]: {
          ...action.payload.info,
          loading: false
        }
      }
    };
  case ALBUM_INFO_SEARCH_ERROR:
    return {
      ...state,
      albumDetails: {
        ...state.albumDetails,
        [action.payload.albumId]: {
          loading: false,
          error: true
        }
      }
    };
  case ARTIST_INFO_SEARCH_START:
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload.artistId]: {
          loading: true
        }
      }
    };
  case ARTIST_INFO_SEARCH_SUCCESS:
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload.artistId]: {
          ...state.artistDetails[action.payload.artistId],
          ...action.payload.info,
          loading: false
        }
      }
    };
  case ARTIST_INFO_SEARCH_ERROR:
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload.artistId]: {
          loading: false,
          error: true
        }
      }
    };
  case ARTIST_RELEASES_SEARCH_START:
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload.artistId]: {
          ...state.artistDetails[action.payload.artistId],
          releases: [],
          releasesLoading: true
        }
      }
    };
  case ARTIST_RELEASES_SEARCH_SUCCESS:
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload.artistId]: {
          ...state.artistDetails[action.payload.artistId],
          releases: action.payload.releases,
          releasesLoading: false
        }
      }
    };
  case ARTIST_RELEASES_SEARCH_ERROR:
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload.artistId]: {
          ...state.artistDetails[action.payload.artistId],
          releases: [],
          releasesLoading: false,
          releasesError: true
        }
      }
    };
  case LASTFM_TRACK_SEARCH_START:
    return reduceLastfmTrackSearchStart(state, action);
  case LASTFM_TRACK_SEARCH_SUCCESS:
    return reduceLastfmTrackSearchSuccess(state, action);
  case YOUTUBE_PLAYLIST_SEARCH_START:
    return reduceYoutubePlaylistSearchStart(state, action);
  case YOUTUBE_PLAYLIST_SEARCH_SUCCESS:
    return reduceYoutubePlaylistSearchSuccess(state, action);
  case SEARCH_DROPDOWN_DISPLAY_CHANGE:
    return reduceSearchDropdownDisplay(state, action);
  default:
    return state;
  }
}
