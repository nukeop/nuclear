import {
  ADD_PLAYLIST,
  LOAD_PLAYLISTS,
  DELETE_PLAYLIST,
  UPDATE_PLAYLIST,
  DELETE_TRACK
} from '../actions/playlists';

const initialState = {
  playlists: []
};

export default function PlaylistsReducer(state=initialState, action) {
  switch (action.type) {
  case LOAD_PLAYLISTS:
  case ADD_PLAYLIST:
  case DELETE_PLAYLIST:
  case UPDATE_PLAYLIST:
  case DELETE_TRACK:
    return Object.assign({}, state, {
      playlists: action.payload.playlists
    });
  default:
    return state;
  }
}
