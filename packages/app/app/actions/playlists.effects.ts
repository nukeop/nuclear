import _ from 'lodash';
import { Playlist } from '@nuclear/core';

export const deletePlaylistEffect = store => id => {
  let playlists: Playlist[] = store.get('playlists');
  playlists = playlists.filter(playlist => playlist.id !== id);
  store.set('playlists', playlists);
  return playlists;
};

export const updatePlaylistEffect = store => playlist => {
  const updatedPlaylist = {
    ...playlist,
    lastModified: Date.now().valueOf()
  };
  const playlists = [...store.get('playlists')];
  const index = _.findIndex(playlists, {id: playlist.id});
  if (index !== -1) {
    playlists.splice(index, 1, updatedPlaylist);
  } else {
    playlists.push(updatedPlaylist);
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
