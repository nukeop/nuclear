import uuidv4 from 'uuid/v4';
import _ from 'lodash';

import {
  deletePlaylistInjectable,
  updatePlaylistInjectable
} from './playlists.injectable';

import { store } from '../persistence/store';

export const LOAD_PLAYLISTS = 'LOAD_PLAYLISTS';
export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';
export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';

export function addPlaylist(tracks, name) {
  return dispatch => {
    let playlists = store.get('playlists') || [];
    let playlist = { name, tracks, id: uuidv4() };

    if (_.isEmpty(tracks)) {
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
      payload: { playlists }
    });
  };
}

export function deletePlaylist(id) {
  return dispatch => {
    const playlists = deletePlaylistInjectable(store)(id);
    
    dispatch({
      type: DELETE_PLAYLIST,
      payload: { playlists }
    });
  };
}

export function loadPlaylists() {
  return dispatch => {
    let playlists = store.get('playlists');

    dispatch({
      type: LOAD_PLAYLISTS,
      payload: { playlists: _.defaultTo(playlists, []) }
    });
  };
}

export function updatePlaylist(playlist) {
  return dispatch => {
    const playlists = updatePlaylistInjectable(store)(playlist);
    dispatch({
      type: UPDATE_PLAYLIST,
      payload: { playlists }
    });
  };
}
