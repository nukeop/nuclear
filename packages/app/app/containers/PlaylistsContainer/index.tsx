import React from 'react';

import Playlists from '../../components/Playlists';
import { useNuclearServicePlaylists, usePlaylistsProps } from './hooks';

const PlaylistsContainer: React.FC = () => {
  const props = usePlaylistsProps();
  useNuclearServicePlaylists();

  return <Playlists
    {...props}
  />;
};

export default PlaylistsContainer;
