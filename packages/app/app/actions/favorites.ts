import _, { flow, omit, unionWith } from 'lodash';
import { store, Album, Artist, Track } from '@nuclear/core';
import { areTracksEqualByName, getTrackItem } from '@nuclear/ui';

import { rewriteTrackArtists, safeAddUuid } from './helpers';
import { createStandardAction } from 'typesafe-actions';
import { TrackItem } from '@nuclear/ui/lib/types';

export const READ_FAVORITES = 'READ_FAVORITES';
export const ADD_FAVORITE_TRACK = 'ADD_FAVORITE_TRACK';
export const REMOVE_FAVORITE_TRACK = 'REMOVE_FAVORITE_TRACK';
export const BULK_ADD_FAVORITE_TRACKS = 'BULK_ADD_FAVORITE_TRACKS';

export const ADD_FAVORITE_ALBUM = 'ADD_FAVORITE_ALBUM';
export const REMOVE_FAVORITE_ALBUM = 'REMOVE_FAVORITE_ALBUM';

export const ADD_FAVORITE_ARTIST = 'ADD_FAVORITE_ARTIST';
export const REMOVE_FAVORITE_ARTIST = 'REMOVE_FAVORITE_ARTIST';

export function readFavorites() {
  const favorites = getFavoritesBackwardsCompatible();
  return {
    type: READ_FAVORITES,
    payload: favorites
  };
}

export function addFavoriteTrack(track) {
  const clonedTrack = flow(safeAddUuid, getTrackItem)(track);
  
  const favorites = getFavoritesBackwardsCompatible();
  const filteredTracks = favorites.tracks.filter(t => !areTracksEqualByName(t, track));
  favorites.tracks = [...filteredTracks, omit(clonedTrack, 'streams')];
  
  store.set('favorites', favorites);
  
  return {
    type: ADD_FAVORITE_TRACK,
    payload: favorites
  };
}

const bulkAddFavoriteTracksAction = createStandardAction(BULK_ADD_FAVORITE_TRACKS)<Track[]>();

export const bulkAddFavoriteTracks = (tracks: Track[]) => {
  const favorites = getFavoritesBackwardsCompatible();
  favorites.tracks = unionWith(favorites.tracks, tracks, areTracksEqualByName);
  store.set('favorites', favorites);

  return bulkAddFavoriteTracksAction(favorites);
};

export function removeFavoriteTrack(track) {
  const favorites = getFavoritesBackwardsCompatible();
  favorites.tracks = favorites.tracks.filter(t => !areTracksEqualByName(t, track));

  store.set('favorites', favorites);

  return {
    type: REMOVE_FAVORITE_TRACK,
    payload: favorites
  };
}

export function addFavoriteAlbum(album) {
  const favorites = getFavoritesBackwardsCompatible();
  favorites.albums = _.concat(favorites.albums, album);
  store.set('favorites', favorites);

  return {
    type: ADD_FAVORITE_ALBUM,
    payload: favorites
  };
}

export function removeFavoriteAlbum(album) {
  const favorites = getFavoritesBackwardsCompatible();
  _.remove(favorites.albums, {
    artist: album.artist,
    title: album.title
  });
  store.set('favorites', favorites);

  return {
    type: REMOVE_FAVORITE_ALBUM,
    payload: favorites
  };
}

export function addFavoriteArtist(artist) {
  
  const favorites = getFavoritesBackwardsCompatible();
  const savedArtist = {
    id: artist.id,
    name: artist.name,
    source: artist.source,
    coverImage: artist.coverImage,
    thumb: artist.thumb
  };

  favorites.artists = _.concat(favorites.artists || [], savedArtist);
  store.set('favorites', favorites);
  
  return {
    type: ADD_FAVORITE_ARTIST,
    payload: favorites
  };
}

export function removeFavoriteArtist(artist) {
  const favorites = getFavoritesBackwardsCompatible();
  _.remove(favorites.artists, {
    id: artist.id,
    name: artist.name
  });
  store.set('favorites', favorites);

  return {
    type: REMOVE_FAVORITE_ARTIST,
    payload: favorites
  };
}

/**
* Helper function to read the old track format into the new format.
*
* `Track.artist` and `Track.extraArtists` are written into {@link Track.artists}
*/
function getFavoritesBackwardsCompatible() {
  const favorites: { albums?: Album[], artists?: Artist[], tracks?: Track[] } = store.get('favorites');

  favorites.tracks = favorites.tracks?.map(rewriteTrackArtists);
  favorites.albums = favorites.albums?.map(album => {
    album.tracklist = album.tracklist?.map(rewriteTrackArtists);
    return album;
  });

  return favorites as any;
}
