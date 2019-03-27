import _ from 'lodash';

import { store } from '../persistence/store';

export const READ_FAVORITES = 'READ_FAVORITES';
export const ADD_FAVORITE_TRACK = 'ADD_FAVORITE_TRACK';

export function readFavorites() {
  const favorites = store.get('favorites');
  return {
    type: READ_FAVORITES,
    payload: favorites
  };
}

export function addFavoriteTrack(track) {
  const favorites = store.get('favorites');
  favorites.tracks = _.concat(favorites.tracks, track);
  store.set('favorites', favorites);
  
  return {
    type: ADD_FAVORITE_TRACK,
    payload: favorites
  };
}
