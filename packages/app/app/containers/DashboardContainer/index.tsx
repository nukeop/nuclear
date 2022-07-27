import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as SearchActions from '../../actions/search';
import * as DashboardActions from '../../actions/dashboard';
import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import Dashboard from '../../components/Dashboard';
import { dashboardSelector } from '../../selectors/dashboard';
import { useHistory } from 'react-router';
import { connectivity } from '../../selectors/connectivity';
import { pluginsSelectors } from '../../selectors/plugins';
import { QueueItem } from '../../reducers/queue';

const DashboardContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const dashboard = useSelector(dashboardSelector);
  const streamProviders = useSelector(pluginsSelectors.plugins).streamProviders;
  const isConnected = useSelector(connectivity);
  
  const loadBestNewTracks = () => dispatch(DashboardActions.loadBestNewTracks());
  const loadBestNewAlbums = () => dispatch(DashboardActions.loadBestNewAlbums());
  const loadTopTags = () => dispatch(DashboardActions.loadTopTags());
  const loadTopTracks = () => dispatch(DashboardActions.loadTopTracks());
  const loadEditorialCharts = () => dispatch(DashboardActions.loadEditorialCharts());
  const loadPromotedArtists = () => dispatch(DashboardActions.loadPromotedArtists());
  
  const artistInfoSearchByName = (artistName: string) => dispatch(SearchActions.artistInfoSearchByName(artistName, history));
  const albumInfoSearchByName = (albumName: string, artistName: string) => dispatch(SearchActions.albumInfoSearchByName(albumName, artistName, history));
  const addToQueue = (item: QueueItem) => dispatch(QueueActions.addToQueue(item));
  const selectSong = (song: number) => dispatch(QueueActions.selectSong(song));
  const clearQueue = () => dispatch(QueueActions.clearQueue());
  const startPlayback = () => dispatch(PlayerActions.startPlayback(false));
  const onEditorialPlaylistClick = (playlistId: number) => history.push(`/editorial-playlist/${playlistId}`);

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

  useEffect(() => {

  }, [isConnected]);

  return (
    <Dashboard
      dashboardData={dashboard}
      streamProviders={streamProviders}
      isConnected={isConnected}

      artistInfoSearchByName={artistInfoSearchByName}
      albumInfoSearchByName={albumInfoSearchByName}
      addToQueue={addToQueue}
      selectSong={selectSong}
      clearQueue={clearQueue}
      startPlayback={startPlayback}
      onEditorialPlaylistClick={onEditorialPlaylistClick}
    />
  );
};

export default DashboardContainer;
