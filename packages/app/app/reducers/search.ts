import { Artist } from '@nuclear/core';
import { AlbumDetails, ArtistDetails, SearchResultsAlbum, SearchResultsPodcast } from '@nuclear/core/src/plugins/plugins.types';
import { LastfmTrackMatchInternal } from '@nuclear/core/src/rest/Lastfm.types';
import { YoutubeResult } from '@nuclear/core/src/rest/Youtube';
import { ActionType, getType } from 'typesafe-actions';
import { SearchActions } from '../actions/search';

export type ArtistDetailsState = Partial<ArtistDetails> & {
  loading?: boolean, 
  error?: boolean, 
  releases?: SearchResultsAlbum[],
  releasesLoading?: boolean, 
  releasesError?: boolean
}

export type AlbumDetailsState = Partial<AlbumDetails> & {loading?: boolean, error?: boolean}

type SearchState = {
  artistSearchResults: Artist[]
  albumSearchResults: SearchResultsAlbum[]
  podcastSearchResults: SearchResultsPodcast[]
  trackSearchResults: string | { id: string, info: LastfmTrackMatchInternal[] } | undefined[]
  playlistSearchResults: { id:string, info: YoutubeResult[] } | undefined[]
  liveStreamSearchResults: { id:string, info: YoutubeResult[] } | undefined[]
  albumDetails:{[key: string]:  AlbumDetailsState }
  artistDetails: {[key: string]: ArtistDetailsState }
  searchHistory: string[]
  unifiedSearchStarted: boolean
  playlistSearchStarted: boolean | string
  liveStreamSearchStarted: boolean | string
  isFocused: boolean
}

const initialState: SearchState = {
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

type SearchReducerActionTypes = ActionType<typeof SearchActions>;

export default function SearchReducer(state = initialState, action: SearchReducerActionTypes):SearchState {
  switch (action.type) {
  case getType(SearchActions.unifiedSearchStart):
    return {
      ...state,
      searchHistory: [
        action.payload,
        ...state.searchHistory
      ],
      unifiedSearchStarted: true
    };
  case getType(SearchActions.unifiedSearchSuccess):
    return {
      ...state,
      unifiedSearchStarted: false
    };
  case getType(SearchActions.albumSearchSuccess):
    return {
      ...state,
      albumSearchResults: action.payload
    };
  case getType(SearchActions.artistSearchSuccess):
    return {
      ...state,
      artistSearchResults: action.payload.map(artist => Artist.fromSearchResultData(artist))
    };
  case getType(SearchActions.podcastSearchSuccess):
    return {
      ...state,
      podcastSearchResults: action.payload
    };
  case getType(SearchActions.albumInfoStart):
    return {
      ...state,
      albumDetails: {
        ...state.albumDetails,
        [`${action.payload.albumId}`]: { loading: true }
      }
    };
  case getType(SearchActions.albumInfoSuccess):
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
  case getType(SearchActions.albumInfoError):
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
  case getType(SearchActions.artistInfoStart):
    return {
      ...state,
      artistDetails: {
        ...state.artistDetails,
        [action.payload]: {
          loading: true
        }
      }
    };
  case getType(SearchActions.artistInfoSuccess):
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
  case getType(SearchActions.artistInfoError):
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
  case getType(SearchActions.artistReleasesStart):
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
  case getType(SearchActions.artistReleasesSuccess):
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
  case getType(SearchActions.artistReleasesError):
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
  case getType(SearchActions.lastFmTrackSearchStart):
    return {
      ...state,
      trackSearchResults: action.payload
    };
  case getType(SearchActions.lastFmTrackSearchSuccess):
    return {
      ...state,
      trackSearchResults: action.payload
    };
  case getType(SearchActions.youtubePlaylistSearchStart):
    return {
      ...state,
      playlistSearchStarted: action.payload,
      playlistSearchResults: []
    };
  case getType(SearchActions.youtubePlaylistSearchSuccess):
    return {
      ...state,
      playlistSearchResults: action.payload
    };
  case getType(SearchActions.youtubeLiveStreamSearchStart):
    return {
      ...state,
      liveStreamSearchStarted: action.payload,
      liveStreamSearchResults: []
    };
  case getType(SearchActions.youtubeLiveStreamSearchSuccess):
    return {
      ...state,
      liveStreamSearchResults: action.payload
    };
  case getType(SearchActions.youtubeLiveStreamSearchError):
    return {
      ...state,
      liveStreamSearchResults: []
    };
  case getType(SearchActions.setSearchDropdownVisibility):
    return {
      ...state,
      isFocused: action.payload
    };
  case getType(SearchActions.updateSearchHistory):
    return {
      ...state,
      searchHistory: action.payload
    };
  default:
    return state;
  }
}
