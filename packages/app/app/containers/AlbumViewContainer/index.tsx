import React, { useCallback } from 'react';
import _ from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as SearchActions from '../../actions/search';
import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as FavoritesActions from '../../actions/favorites';

import AlbumView from '../../components/AlbumView';
import { searchSelectors } from '../../selectors/search';
import { favoritesSelectors } from '../../selectors/favorites';
import { safeAddUuid } from '../../actions/helpers';
import { pluginsSelectors } from '../../selectors/plugins';
import { stringDurationToSeconds } from '../../utils';

const getIsFavorite = (currentAlbum, favoriteAlbums) => {
  const album = _.find(favoriteAlbums, {
    artist: currentAlbum?.artist,
    title: currentAlbum?.title
  });
  return !!album;
};

const AlbumViewContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { albumId } = useParams<{ albumId: string }>();

  const albumDetails = useSelector(searchSelectors.albumDetails);
  // TODO replace this any with a proper type
  const plugins: any = useSelector(pluginsSelectors.plugins);
  const favoriteAlbums = useSelector(favoritesSelectors.albums);
  const album = albumDetails[albumId];
  
  album.tracklist = album?.tracklist?.map(track => ({
    ...track,
    name: track.title,
    thumbnail: album.coverImage,
    duration: parseInt(track.duration) !== track.duration
      ? stringDurationToSeconds(track.duration)
      : track.duration,
    artist: {
      name: album.artist
    }
  }));

  const isFavorite = getIsFavorite(album, favoriteAlbums);

  const searchAlbumArtist = useCallback(() => dispatch(
    SearchActions.artistInfoSearchByName(
      album?.artist,
      history
    )), [album, dispatch, history]);

  const addAlbumToDownloads = useCallback(async () => {
    await album?.tracklist.forEach(async track => {
      const clonedTrack = {
        ...safeAddUuid(track),
        artist: track.artist.name,
        title: track.name
      };
      dispatch(DownloadsActions.addToDownloads(plugins.streamProviders, clonedTrack));
    });
  }, [album, dispatch, plugins]);

  const addAlbumToQueue = useCallback(async () => {
    await album?.tracklist.forEach(async track => {
      dispatch(QueueActions.addToQueue({
        artist: album?.artist,
        name: track.title,
        thumbnail: album.coverImage
      }));
    });
  }, [album, dispatch]);

  const playAll = useCallback(async () => {
    await dispatch(QueueActions.clearQueue());
    await addAlbumToQueue();
    await dispatch(QueueActions.selectSong(0));
    await dispatch(PlayerActions.startPlayback());
  }, [addAlbumToQueue, dispatch]);

  const addFavoriteAlbum = useCallback(async () => {
    await dispatch(FavoritesActions.addFavoriteAlbum(album));
  }, [album, dispatch]);

  const removeFavoriteAlbum = useCallback(async () => {
    await dispatch(FavoritesActions.removeFavoriteAlbum(album));
  }, [album, dispatch]);

  return <AlbumView
    album={album}
    isFavorite={isFavorite}
    searchAlbumArtist={searchAlbumArtist}
    addAlbumToDownloads={addAlbumToDownloads}
    addAlbumToQueue={addAlbumToQueue}
    playAll={playAll}
    removeFavoriteAlbum={removeFavoriteAlbum}
    addFavoriteAlbum={addFavoriteAlbum}
  />;
};

export default AlbumViewContainer;
