import _ from 'lodash';
import { Playlist } from '@nuclear/core';

export const deletePlaylistEffect = store => id => {
  let playlists: Playlist[] = store.get('playlists');
  playlists = playlists.filter(playlist => playlist.id !== id);
  store.set('playlists', playlists);
  return playlists;
};

export const updatePlaylistEffect = store => playlist => {
  const playlists = [...store.get('playlists')];
  const index = _.findIndex(playlists, {id: playlist.id});
  if (index !== -1) {
    playlists.splice(index, 1, playlist);
  } else {
    playlists.push(playlist);
  }
  store.set('playlists', playlists);
  return playlists;
};

export const updatePlaylistsOrderEffect = store => (source: number, destination: number) => {
  const playlists: Playlist[] = [...store.get('playlists')];
  const [removed] = playlists.splice(source, 1);
  playlists.splice(destination, 0, removed);
  store.set('playlists', playlists);
  return playlists;
};
