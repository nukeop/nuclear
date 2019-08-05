import _ from 'lodash';

export const deletePlaylistInjectable = store => id => {
  let playlists = store.get('playlists');
  _.remove(playlists, { id });
  store.set('playlists', playlists);
  return playlists;
};
