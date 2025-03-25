import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import * as SearchActions from '../../actions/search';
import * as DashboardActions from '../../actions/dashboard';
import * as FavoritesActions from '../../actions/favorites';

import Dashboard from '../../components/Dashboard';
import { dashboardSelector } from '../../selectors/dashboard';
import { connectivity } from '../../selectors/connectivity';
import { settingsSelector } from '../../selectors/settings';

const DashboardContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const dashboard = useSelector(dashboardSelector);
  const isConnected = useSelector(connectivity);
  
  const loadTopTags = () => dispatch(DashboardActions.loadTopTags());
  const loadTopTracks = () => dispatch(DashboardActions.loadTopTracks());
  const loadEditorialCharts = () => dispatch(DashboardActions.loadEditorialCharts());
  
  const artistInfoSearchByName = (artistName: string) => dispatch(SearchActions.artistInfoSearchByName(artistName, history));
  const albumInfoSearchByName = (albumName: string, artistName: string) => dispatch(SearchActions.albumInfoSearchByName(albumName, artistName, history));
  const onEditorialPlaylistClick = (playlistId: number) => history.push(`/playlists/deezer/${playlistId}`);

  useEffect(() => {
    dispatch(FavoritesActions.readFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      loadTopTags();
      loadTopTracks();

      if (!dashboard.editorialCharts.isReady && !dashboard.editorialCharts.isLoading) {
        loadEditorialCharts();
      }
    }
  }, [isConnected]);

  
  return (
    <Dashboard
      dashboardData={dashboard}
      isConnected={isConnected}
      artistInfoSearchByName={artistInfoSearchByName}
      albumInfoSearchByName={albumInfoSearchByName}
      onEditorialPlaylistClick={onEditorialPlaylistClick}
    />
  );
};

export default DashboardContainer;
