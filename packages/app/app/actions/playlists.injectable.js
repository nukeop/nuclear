import _ from 'lodash';

export const deletePlaylistInjectable = store => id => {
  let playlists = store.get('playlists');
  _.remove(playlists, { id });
  store.set('playlists', playlists);
  return playlists;
};

export const updatePlaylistInjectable = store => playlist => {
  let playlists = store.get('playlists');
  _.remove(playlists, { id: playlist.id });
  playlists.push(playlist);
  store.set('playlists', playlists);
  return playlists;
};
