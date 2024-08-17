import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { loadEditorialCharts, loadEditorialPlaylist } from '../../actions/dashboard';
import { isNil } from 'lodash';
import { dashboardSelector, editorialPlaylistSelector, playlistTracksSelector } from '../../selectors/dashboard';
import PlaylistViewContainer from '../PlaylistViewContainer';
import { Dimmer, Loader } from 'semantic-ui-react';


const DeezerPlaylistAdapter: React.FC = () => {
  const dispatch = useDispatch();
  const { playlistId } = useParams<{ playlistId: string }>();

  const dashboardData = useSelector(dashboardSelector);
  const playlist = useSelector(editorialPlaylistSelector(parseInt(playlistId)));
  const tracks = useSelector(playlistTracksSelector(parseInt(playlistId)));
  const isLoading = !(tracks?.isReady && dashboardData.editorialCharts.isReady);

  useEffect(() => {
    dispatch(loadEditorialCharts());
  }, []);

  useEffect(() => {
    if (!isNil(playlistId) && !tracks?.isReady && !tracks?.isLoading) {
      dispatch(loadEditorialPlaylist(parseInt(playlistId)));
    }
  }, [playlistId]);
  

  return !isLoading ?
    <PlaylistViewContainer 
      playlist={{
        id: playlist.id.toString(),
        name: playlist.title,
        tracks: tracks.data.tracklist
      }}
      isExternal
      externalSourceName='Deezer'
    />
    : <Dimmer active><Loader /></Dimmer>;
};

export default DeezerPlaylistAdapter;
