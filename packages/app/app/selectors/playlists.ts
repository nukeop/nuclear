import { createStateSelectors } from './helpers';

export const playlistsSelectors = createStateSelectors(
  'playlists',
  [
    'localPlaylists',
    'remotePlaylists'
  ]
);
