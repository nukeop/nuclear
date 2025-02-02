import _, { flow, omit, unionWith } from 'lodash';
import { Album, Artist, store } from '@nuclear/core';
import { areTracksEqualByName, getTrackItem } from '@nuclear/ui';

import { safeAddUuid } from './helpers';
import { createStandardAction } from 'typesafe-actions';
import { addToDownloads } from './downloads';
import StreamProviderPlugin from '@nuclear/core/src/plugins/streamProvider';
import { Track } from '@nuclear/ui/lib/types';

type Settings = {
  [key: string]: boolean | string | number;
}

type Favorites = {
  tracks: Track[];
  albums: Album[];
  artists: (Artist & {id?: string;})[];
}

export const READ_FAVORITES = 'READ_FAVORITES';
export const ADD_FAVORITE_TRACK = 'ADD_FAVORITE_TRACK';
export const REMOVE_FAVORITE_TRACK = 'REMOVE_FAVORITE_TRACK';
export const BULK_ADD_FAVORITE_TRACKS = 'BULK_ADD_FAVORITE_TRACKS';

export const ADD_FAVORITE_ALBUM = 'ADD_FAVORITE_ALBUM';
export const REMOVE_FAVORITE_ALBUM = 'REMOVE_FAVORITE_ALBUM';

export const ADD_FAVORITE_ARTIST = 'ADD_FAVORITE_ARTIST';
export const REMOVE_FAVORITE_ARTIST = 'REMOVE_FAVORITE_ARTIST';


export function readFavorites() {
  const favorites = store.get('favorites') as Favorites;
  return {
    type: READ_FAVORITES,
    payload: favorites
  };
}

export function addFavoriteTrack(track) {
  const clonedTrack = flow(safeAddUuid, getTrackItem)(track);
  
  const favorites = store.get('favorites') as Favorites;
  const filteredTracks = favorites.tracks.filter(t => !areTracksEqualByName(t, track)) as Track[];
  favorites.tracks = [...filteredTracks, omit(clonedTrack, 'streams')];
  
  store.set('favorites', favorites);

  const settings = store.get('settings') as Settings;
  const autoDownloadFavourites = settings.autoDownloadFavourites;
  
  if (autoDownloadFavourites) {
    const streamProviders: StreamProviderPlugin[] = (store.get('StreamProvider') || []) as StreamProviderPlugin[];
    
    addToDownloads(streamProviders, track);
  }
  
  return {
    type: ADD_FAVORITE_TRACK,
    payload: favorites
  };
}

const bulkAddFavoriteTracksAction = createStandardAction(BULK_ADD_FAVORITE_TRACKS)<Favorites>();

export const bulkAddFavoriteTracks = (tracks: Track[]) => {
  const favorites = store.get('favorites') as Favorites;
  favorites.tracks = unionWith(favorites.tracks, tracks, areTracksEqualByName);
  store.set('favorites', favorites);

  return bulkAddFavoriteTracksAction(favorites);
};

export function removeFavoriteTrack(track) {
  const favorites = store.get('favorites') as Favorites;
  favorites.tracks = favorites.tracks.filter(t => !areTracksEqualByName(t, track));

  store.set('favorites', favorites);

  return {
    type: REMOVE_FAVORITE_TRACK,
    payload: favorites
  };
}

export function addFavoriteAlbum(album) {
  const favorites = store.get('favorites') as Favorites;
  favorites.albums = _.concat(favorites.albums, album);
  store.set('favorites', favorites);

  return {
    type: ADD_FAVORITE_ALBUM,
    payload: favorites
  };
}

export function removeFavoriteAlbum(album) {
  const favorites = store.get('favorites') as Favorites;
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
  
  const favorites = store.get('favorites') as Favorites;
  const savedArtist = {
    id: artist.id,
    name: artist.name,
    source: artist.source,
    coverImage: artist.coverImage,
    thumb: artist.thumb
  } as unknown as Artist;

  favorites.artists = _.concat(favorites.artists || [], savedArtist);
  store.set('favorites', favorites);
  
  return {
    type: ADD_FAVORITE_ARTIST,
    payload: favorites
  };
}

export function removeFavoriteArtist(artist) {
  const favorites = store.get('favorites') as Favorites;
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
