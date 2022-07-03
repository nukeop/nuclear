import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { loadEditorialCharts, loadEditorialPlaylist } from '../../actions/dashboard';
import { isNil } from 'lodash';
import { dashboardSelector, editorialPlaylistSelector, playlistTracksSelector } from '../../selectors/dashboard';
import PlaylistViewContainer from '../PlaylistViewContainer';


const DeezerPlaylistAdapter: React.FC = () => {
  const dispatch = useDispatch();
  const { playlistId } = useParams<{ playlistId: string }>();

  useEffect(() => {
    dispatch(loadEditorialCharts());
  }, []);

  useEffect(() => {
    if (!isNil(playlistId)) {
      dispatch(loadEditorialPlaylist(parseInt(playlistId)));
    }
  }, [playlistId]);

  const dashboardData = useSelector(dashboardSelector);
  const playlist = useSelector(editorialPlaylistSelector(parseInt(playlistId)));
  const tracks = useSelector(playlistTracksSelector(parseInt(playlistId)));

  return tracks?.isReady && dashboardData.editorialCharts.isReady ?
    <PlaylistViewContainer 
      playlist={{
        id: playlist.id.toString(),
        name: playlist.title,
        tracks: tracks.data.tracklist
      }}
    />
    : null;
};

export default DeezerPlaylistAdapter;
