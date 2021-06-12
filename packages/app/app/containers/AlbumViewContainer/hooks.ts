import _ from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import * as SearchActions from '../../actions/search';
import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as FavoritesActions from '../../actions/favorites';
import { safeAddUuid } from '../../actions/helpers';
import { favoritesSelectors } from '../../selectors/favorites';
import { pluginsSelectors } from '../../selectors/plugins';
import { searchSelectors } from '../../selectors/search';
import { stringDurationToSeconds } from '../../utils';

export const useAlbumViewProps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { albumId } = useParams<{ albumId: string }>();

  const albumDetails = useSelector(searchSelectors.albumDetails);
  // TODO replace this any with a proper type
  const plugins: any = useSelector(pluginsSelectors.plugins);
  const favoriteAlbums: { id: string }[] = useSelector(favoritesSelectors.albums);

  const albumFromFavorites = favoriteAlbums.find(album => album.id === albumId);
  const album = albumFromFavorites || albumDetails[albumId];

  if (album) {
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
  }

  const getIsFavorite = (currentAlbum, favoriteAlbums) => {
    const favoriteAlbum = _.find(favoriteAlbums, {
      id: currentAlbum?.id
    });
    return Boolean(favoriteAlbum);
  };
  const isFavorite = getIsFavorite(album, favoriteAlbums);

  const searchAlbumArtist = useCallback(() => dispatch(
    SearchActions.artistInfoSearchByName(
      album?.artist,
      history
    )), [album, dispatch, history]);

  const addAlbumToDownloads = useCallback(async () => {
    await album?.tracklist.forEach(async track => {
      const clonedTrack = { ...safeAddUuid(track) };
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
    dispatch(QueueActions.clearQueue());
    await addAlbumToQueue();
    dispatch(QueueActions.selectSong(0));
    dispatch(PlayerActions.startPlayback());
  }, [addAlbumToQueue, dispatch]);

  const addFavoriteAlbum = useCallback(async () => {
    dispatch(FavoritesActions.addFavoriteAlbum(album));
  }, [album, dispatch]);

  const removeFavoriteAlbum = useCallback(async () => {
    dispatch(FavoritesActions.removeFavoriteAlbum(album));
  }, [album, dispatch]);

  return {
    album,
    isFavorite,
    searchAlbumArtist,
    addAlbumToDownloads,
    addAlbumToQueue,
    playAll,
    addFavoriteAlbum,
    removeFavoriteAlbum
  };
};
