import { v4 } from 'uuid';
import _ from 'lodash';
import { store, PlaylistHelper } from '@nuclear/core';
import fs from 'fs';

import {
  deletePlaylistInjectable,
  updatePlaylistInjectable
} from './playlists.injectable';
import { success, error } from './toasts';


export const LOAD_PLAYLISTS = 'LOAD_PLAYLISTS';
export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';
export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';

export function addPlaylist(tracks, name) {
  return dispatch => {
    let playlists = store.get('playlists') || [];
    const playlist = PlaylistHelper.formatPlaylistForStorage(name, tracks, v4());

    if (_.isEmpty(tracks)) {
      dispatch({
        type: null
      });
      return;
    }

    playlists = [...playlists, playlist];

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
    const playlists = store.get('playlists');

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

export function addPlaylistFromFile(filePath, t) {
  return async dispatch => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        dispatch(error(t('import-fail-title'), t('error-open-file'), null, null));
        return;
      }

      try {
        const parsed = JSON.parse(data.toString());
        const name = _.get(parsed, 'name', null);
        const tracks = _.get(parsed, 'tracks', null);

        if (!name || !tracks) {
          throw new Error('missing tracks or name');
        }

        let playlists = store.get('playlists') || [];
        const playlist = PlaylistHelper.formatPlaylistForStorage(name, tracks, v4());

        if (_.isEmpty(tracks)) {
          dispatch(error(t('import-fail-title'), t('error-empty-data'), null, null));
          return;
        }

        playlists = [...playlists, playlist];

        store.set('playlists', playlists);
        dispatch(success(t('import-success-title'), t('playlist-created', { name }), null, null));
        dispatch({
          type: ADD_PLAYLIST,
          payload: { playlists }
        });

      } catch (e) {
        dispatch(error(t('import-fail-title'), t('error-invalid-data'), null, null));
      }
    });
  };
}
