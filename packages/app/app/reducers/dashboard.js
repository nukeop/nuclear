import {
  LOAD_BEST_NEW_ALBUMS_SUCCESS,
  LOAD_BEST_NEW_TRACKS_SUCCESS,
  LOAD_TOP_TAGS_SUCCESS,
  LOAD_TOP_TRACKS_SUCCESS
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
