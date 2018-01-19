import {
  LOAD_BEST_NEW_ALBUMS_START,
  LOAD_BEST_NEW_ALBUMS_SUCCESS,
  LOAD_BEST_NEW_ALBUMS_ERROR,

  LOAD_BEST_NEW_TRACKS_START,
  LOAD_BEST_NEW_TRACKS_SUCCESS,
  LOAD_BEST_NEW_TRACKS_ERROR,

  LOAD_NUCLEAR_NEWS_START,
  LOAD_NUCLEAR_NEWS_SUCCESS,
  LOAD_NUCLEAR_NEWS_ERROR
} from '../actions/dashboard';

const initialState = {
  bestNewAlbums: [],
  bestNewTracks: []
};

export default function DashboardReducer(state=initialState, action) {
  switch(action.type) {
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
  default:
    return state;
  }
}
