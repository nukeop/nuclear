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
  return {
    type: ADD_FAVORITE_TRACK,
    payload: track
  };
}
