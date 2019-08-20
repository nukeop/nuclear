import _ from 'lodash';

import { safeAddUuid } from './helpers';
import { store } from '../persistence/store';

export const READ_FAVORITES = 'READ_FAVORITES';
export const ADD_FAVORITE_TRACK = 'ADD_FAVORITE_TRACK';
export const REMOVE_FAVORITE_TRACK = 'REMOVE_FAVORITE_TRACK';

export const ADD_FAVORITE_ALBUM = 'ADD_FAVORITE_ALBUM';
export const REMOVE_FAVORITE_ALBUM = 'REMOVE_FAVORITE_ALBUM';

export function readFavorites() {
  const favorites = store.get('favorites');
  return {
    type: READ_FAVORITES,
    payload: favorites
  };
}

export function addFavoriteTrack(track) {
  const clonedTrack = safeAddUuid(track);

  const favorites = store.get('favorites');
  favorites.tracks = _.concat(favorites.tracks, clonedTrack);

  store.set('favorites', favorites);

  return {
    type: ADD_FAVORITE_TRACK,
    payload: favorites
  };
}

export function removeFavoriteTrack(track) {
  const favorites = store.get('favorites');
  _.remove(favorites.tracks, { uuid: track.uuid });
  store.set('favorites', favorites);

  return {
    type: REMOVE_FAVORITE_TRACK,
    payload: favorites
  };
}

export function addFavoriteAlbum(album) {
  const favorites = store.get('favorites');
  favorites.albums = _.concat(favorites.albums, album);
  store.set('favorites', favorites);

  return {
    type: ADD_FAVORITE_ALBUM,
    payload: favorites
  };
}

export function removeFavoriteAlbum(album) {
  const favorites = store.get('favorites');
  _.remove(favorites.albums, { id: album.id });
  store.set('favorites', favorites);

  return {
    type: REMOVE_FAVORITE_ALBUM,
    payload: favorites
  };
}
