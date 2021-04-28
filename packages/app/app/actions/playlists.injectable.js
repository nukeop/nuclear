import _ from 'lodash';

export const deletePlaylistInjectable = store => id => {
  const playlists = store.get('playlists');
  _.remove(playlists, { id });
  store.set('playlists', playlists);
  return playlists;
};

export const updatePlaylistInjectable = store => playlist => {
  const playlists = store.get('playlists');
  const index = _.findIndex(playlists, {id: playlist.id});
  if (index !== -1) {
    playlists.splice(index, 1, playlist);
  } else {
    playlists.push(playlist);
  }
  store.set('playlists', playlists);
  return playlists;
};
