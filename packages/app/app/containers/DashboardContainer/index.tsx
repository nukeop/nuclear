import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import * as SearchActions from '../../actions/search';
import * as DashboardActions from '../../actions/dashboard';
import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import Dashboard from '../../components/Dashboard';
import { dashboardSelector } from '../../selectors/dashboard';
import { connectivity } from '../../selectors/connectivity';
import { pluginsSelectors } from '../../selectors/plugins';
import { QueueItem } from '../../reducers/queue';
import { settingsSelector } from '../../selectors/settings';

const DashboardContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const dashboard = useSelector(dashboardSelector);
  const streamProviders = useSelector(pluginsSelectors.plugins).streamProviders;
  const isConnected = useSelector(connectivity);
  const settings = useSelector(settingsSelector);
  
  const loadBestNewTracks = () => dispatch(DashboardActions.loadBestNewTracks());
  const loadBestNewAlbums = () => dispatch(DashboardActions.loadBestNewAlbums());
  const loadTopTags = () => dispatch(DashboardActions.loadTopTags());
  const loadTopTracks = () => dispatch(DashboardActions.loadTopTracks());
  const loadEditorialCharts = () => dispatch(DashboardActions.loadEditorialCharts());
  const loadPromotedArtists = () => dispatch(DashboardActions.loadPromotedArtists());
  
  const artistInfoSearchByName = (artistName: string) => dispatch(SearchActions.artistInfoSearchByName(artistName, history));
  const albumInfoSearchByName = (albumName: string, artistName: string) => dispatch(SearchActions.albumInfoSearchByName(albumName, artistName, history));
  const onEditorialPlaylistClick = (playlistId: number) => history.push(`/editorial-playlist/${playlistId}`);
  const isPromotedArtistsEnabled = settings.promotedArtists;

  useEffect(() => {
    dispatch(FavoritesActions.readFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      loadBestNewTracks();
      loadBestNewAlbums();
      loadTopTags();
      loadTopTracks();
      loadPromotedArtists();

      if (!dashboard.editorialCharts.isReady && !dashboard.editorialCharts.isLoading) {
        loadEditorialCharts();
      }
    }
  }, [isConnected]);

  
  return (
    <Dashboard
      dashboardData={dashboard}
      isConnected={isConnected}
      isPromotedArtistsEnabled={isPromotedArtistsEnabled}
      artistInfoSearchByName={artistInfoSearchByName}
      albumInfoSearchByName={albumInfoSearchByName}
      onEditorialPlaylistClick={onEditorialPlaylistClick}
    />
  );
};

export default DashboardContainer;
