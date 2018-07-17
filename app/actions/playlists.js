import { store } from '../persistence/store';

export const LOAD_PLAYLISTS = 'LOAD_PLAYLISTS';
export const ADD_PLAYLIST = 'ADD_PLAYLIST';

export function addPlaylist(tracks, name) {
  return dispatch => {
    let playlists = store.get('playlists') || {};
    let playlist = {name, tracks};

    if (tracks.length === 0) {
      dispatch({
	      type: null
      });
      return;
    }

    if (playlists) {
      playlists.push(playlist);
    } else {
      playlists = [playlist];
    }

    store.set('playlists', playlists);
    dispatch({
      type: ADD_PLAYLIST,
      payload: playlists
    });
  };
}

export function loadPlaylists() {
  return dispatch => {
    let playlists = store.get('playlists') || {};

    if (playlists) {
      dispatch({
	      type: LOAD_PLAYLISTS,
	      payload: playlists
      });
    } else {
      dispatch({
	      type: LOAD_PLAYLISTS,
	      payload: []
      });
    }
  };
}
