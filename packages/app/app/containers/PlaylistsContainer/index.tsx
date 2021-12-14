import React from 'react';

import Playlists from '../../components/Playlists';
import { usePlaylistsProps } from './hooks';

const PlaylistsContainer: React.FC = () => {
  const props = usePlaylistsProps();

  return <Playlists
    {...props}
  />;
};

export default PlaylistsContainer;
