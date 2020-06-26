import _ from 'lodash';
import { store } from '@nuclear/core';

import { safeAddUuid } from './helpers';

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

export function replaceFavoriteTrack(i, moveUp, length) {
  const favorites = store.get('favorites');

  if (moveUp && i) {
    const deleted = favorites.tracks.splice(i - 1, 1, favorites.tracks[i]);
    favorites.tracks.splice(i, 1, ...deleted);
    store.set('favorites', favorites);
  } else if (!moveUp && i + 1 !== length) {
    const deleted = favorites.tracks.splice(i + 1, 1, favorites.tracks[i]);
    favorites.tracks.splice(i, 1, ...deleted);
    store.set('favorites', favorites);
  }

  return {
    type: READ_FAVORITES,
    payload: favorites
  };
}

export function sortFavoriteTracksByTitels() {
  const favorites = store.get('favorites');

  favorites.tracks.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  store.set('favorites', favorites);
  return {
    type: READ_FAVORITES,
    payload: favorites
  };
}

export function sortFavoriteTracksByArtistNames() {
  const favorites = store.get('favorites');

  favorites.tracks.sort((a, b) => {
    if (a.artist.name < b.artist.name) {
      return -1;
    }
    if (a.artist.name > b.artist.name) {
      return 1;
    }
    return 0;
  });

  store.set('favorites', favorites);
  return {
    type: READ_FAVORITES,
    payload: favorites
  };
}

export function addFavoriteTrack(track) {
  const clonedTrack = safeAddUuid(track);

  const favorites = store.get('favorites');
  const filteredTracks = favorites.tracks.filter(({ name, artist }) => {
    return artist.name !== clonedTrack.artist.name || name !== clonedTrack.name;
  });
  favorites.tracks = _.concat(filteredTracks, clonedTrack);

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
