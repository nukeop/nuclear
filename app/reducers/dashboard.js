import {
  LOAD_BEST_NEW_ALBUMS_START,
  LOAD_BEST_NEW_ALBUMS_SUCCESS,
  LOAD_BEST_NEW_ALBUMS_ERROR,
  LOAD_BEST_NEW_TRACKS_START,
  LOAD_BEST_NEW_TRACKS_SUCCESS,
  LOAD_BEST_NEW_TRACKS_ERROR,
  LOAD_NUCLEAR_NEWS_START,
  LOAD_NUCLEAR_NEWS_SUCCESS,
  LOAD_NUCLEAR_NEWS_ERROR,
  LOAD_TOP_TAGS_START,
  LOAD_TOP_TAGS_SUCCESS,
  LOAD_TOP_TAGS_ERROR,
  LOAD_TOP_TRACKS_START,
  LOAD_TOP_TRACKS_SUCCESS,
  LOAD_TOP_TRACKS_ERROR
} from '../actions/dashboard';

const initialState = {
  bestNewAlbums: [],
  bestNewTracks: [],
  topTracks: []
};

export default function DashboardReducer(state = initialState, action) {
  switch (action.type) {
  case LOAD_BEST_NEW_ALBUMS_SUCCESS:
    return Object.assign({}, state, {
      bestNewAlbums: action.payload
    });
  case LOAD_BEST_NEW_TRACKS_SUCCESS:
    return Object.assign({}, state, {
      bestNewTracks: action.payload
    });
  case LOAD_NUCLEAR_NEWS_SUCCESS:
    return Object.assign({}, state, {
      news: action.payload
    });
  case LOAD_TOP_TAGS_SUCCESS:
    return Object.assign({}, state, {
      topTags: action.payload
    });
  case LOAD_TOP_TRACKS_SUCCESS:
    return Object.assign({}, state, {
      topTracks: action.payload
    });
  default:
    return state;
  }
}
