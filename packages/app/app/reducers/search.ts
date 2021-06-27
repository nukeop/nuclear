import { Artist } from '@nuclear/core';
import { Search } from '../actions/actionTypes';

const initialState = {
  plugins: [],
  artistSearchResults: [],
  albumSearchResults: [],
  podcastSearchResults: [],
  trackSearchResults: [],
  playlistSearchResults: [],
  liveStreamSearchResults: [],
  albumDetails: {},
  artistDetails: {},
  searchHistory: [],
  unifiedSearchStarted: false,
  playlistSearchStarted: false,
  liveStreamSearchStarted: false,
  isFocused: false
};

function reduceAlbumSearchSuccess(state, action) {
  return {
    ...state,
    albumSearchResults: action.payload
  };
}

function reducePodcastSearchSuccess(state, action) {
  return {
    ...state,
    podcastSearchResults: action.payload
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
    playlistSearchStarted: action.payload.terms,
    playlistSearchResults: []
  };
}

function reduceYoutubePlaylistSearchSuccess(state, action) {
  return {
    ...state,
    playlistSearchResults: action.payload
  };
}

function reduceYoutubeLiveStreamSearchStart(state, action) {
  return {
    ...state,
    liveStreamSearchStarted: action.payload.terms,
    liveStreamSearchResults: []
  };
}

function reduceYoutubeLiveStreamSearchSuccess(state, action) {
  return {
    ...state,
    liveStreamSearchResults: action.payload
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
  case Search.UNIFIED_SEARCH_START:
    return {
      ...state,
      searchHistory: [
        action.payload.terms,
        ...state.searchHistory
      ],
      unifiedSearchStarted: true
    };
  case Search.UNIFIED_SEARCH_SUCCESS:
    return {
      ...state,
      unifiedSearchStarted: false
    };
  case Search.ALBUM_SEARCH_SUCCESS:
    return reduceAlbumSearchSuccess(state, action);
  case Search.ARTIST_SEARCH_SUCCESS:
    return reduceArtistSearchSuccess(state, action);
  case Search.PODCAST_SEARCH_SUCCESS:
    return reducePodcastSearchSuccess(state, action);
  case Search.ALBUM_INFO_SEARCH_START:
    return {
      ...state,
      albumDetails: {
        ...state.albumDetails,
        [`${action.payload.albumId}`]: { loading: true }
      }
    };
  case Search.ALBUM_INFO_SEARCH_SUCCESS:
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
  case Search.ALBUM_INFO_SEARCH_ERROR:
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
  case Search.ARTIST_INFO_SEARCH_START:
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload.artistId]: {
          loading: true
        }
      }
    };
  case Search.ARTIST_INFO_SEARCH_SUCCESS:
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
  case Search.ARTIST_INFO_SEARCH_ERROR:
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
  case Search.ARTIST_RELEASES_SEARCH_START:
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
  case Search.ARTIST_RELEASES_SEARCH_SUCCESS:
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
  case Search.ARTIST_RELEASES_SEARCH_ERROR:
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
  case Search.LASTFM_TRACK_SEARCH_START:
    return reduceLastfmTrackSearchStart(state, action);
  case Search.LASTFM_TRACK_SEARCH_SUCCESS:
    return reduceLastfmTrackSearchSuccess(state, action);
  case Search.YOUTUBE_PLAYLIST_SEARCH_START:
    return reduceYoutubePlaylistSearchStart(state, action);
  case Search.YOUTUBE_PLAYLIST_SEARCH_SUCCESS:
    return reduceYoutubePlaylistSearchSuccess(state, action);
  case Search.YOUTUBE_LIVESTREAM_SEARCH_START:
    return reduceYoutubeLiveStreamSearchStart(state, action);
  case Search.YOUTUBE_LIVESTREAM_SEARCH_SUCCESS:
    return reduceYoutubeLiveStreamSearchSuccess(state, action);
  case Search.YOUTUBE_LIVESTREAM_SEARCH_ERROR:
    return {
      ...state,
      liveStreamSearchResults: []
    };
  case Search.SEARCH_DROPDOWN_DISPLAY_CHANGE:
    return reduceSearchDropdownDisplay(state, action);
  case Search.UPDATE_SEARCH_HISTORY:
    return {
      ...state,
      searchHistory: action.payload
    };
  default:
    return state;
  }
}
