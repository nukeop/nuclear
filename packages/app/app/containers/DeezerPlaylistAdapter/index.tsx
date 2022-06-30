import React, {  } from 'react';

import { DeezerPlaylist } from '@nuclear/core/src/rest/Deezer';
// import { useParams } from 'react-router';

type DeezerPlaylistAdapterProps = {
    playlist: DeezerPlaylist;
}

const DeezerPlaylistAdapter: React.FC<DeezerPlaylistAdapterProps> = ({
  playlist
}) => {
  // const { playlistId } = useParams<{ playlistId: string }>();
  
  return <div>{playlist.link}</div>;
};

export default DeezerPlaylistAdapter;
