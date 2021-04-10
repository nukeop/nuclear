import { useSelector } from 'react-redux';

import { playlistsSelectors } from '../../selectors/playlists';
import { Playlist } from '@nuclear/core/src/helpers/playlist/types';

export const usePlaylistsProps = () => {
  const playlists = useSelector(playlistsSelectors.playlists) as Playlist[];
  
  return {
    playlists
  };
};
