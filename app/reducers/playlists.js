import {
  ADD_PLAYLIST,
  LOAD_PLAYLISTS,
  DELETE_PLAYLIST,
  RENAME_PLAYLIST
} from '../actions/playlists';

const initialState = {
  playlists: []
};

export default function PlaylistsReducer(state=initialState, action) {
  switch (action.type) {
  case LOAD_PLAYLISTS:
  case ADD_PLAYLIST:
    return Object.assign({}, state, {
      playlists: action.payload
    });
  case DELETE_PLAYLIST:
    return Object.assign({}, state, {
      playlists: action.payload
    });
  case RENAME_PLAYLIST:
    return Object.assign({}, state, {
      playlists: action.payload
    });
  default:
    return state;
  }
}
