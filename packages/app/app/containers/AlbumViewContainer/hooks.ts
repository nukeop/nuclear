import _ from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import { artistInfoSearchByName } from '../../actions/search';
import { addToDownloads } from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as FavoritesActions from '../../actions/favorites';
import { safeAddUuid } from '../../actions/helpers';
import { favoritesSelectors } from '../../selectors/favorites';
import { pluginsSelectors } from '../../selectors/plugins';
import { searchSelectors } from '../../selectors/search';
import { stringDurationToSeconds } from '../../utils';
import { AlbumDetailsState } from '../../reducers/search';
import { playlistsSelectors } from '../../selectors/playlists';
import * as PlaylistActions from '../../actions/playlists';
import { PlaylistTrack, Track } from '@nuclear/core';
import { PluginsState } from '../../reducers/plugins';

export const useAlbumViewProps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { albumId } = useParams<{ albumId: string }>();

  const albumDetails: {[key:string]: AlbumDetailsState} = useSelector(searchSelectors.albumDetails);
  const plugins: PluginsState['plugins'] = useSelector(pluginsSelectors.plugins);
  const favoriteAlbums = useSelector(favoritesSelectors.albums);
  const localPlaylists = useSelector(playlistsSelectors.localPlaylists);

  const albumFromFavorites = favoriteAlbums.find(album => String(album.id) === albumId);
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
    artistInfoSearchByName(
      album?.artist,
      history
    )), [album, dispatch, history]);

  const addAlbumToDownloads = useCallback(async () => {
    await album?.tracklist.forEach(async track => {
      const clonedTrack = { ...safeAddUuid(track) };
      dispatch(addToDownloads(plugins.streamProviders, clonedTrack));
    });
  }, [album, dispatch, plugins]);

  const addAlbumToQueue = useCallback(async () => {
    await album?.tracklist.forEach(async track => {
      dispatch(QueueActions.addToQueue({
        artist: album?.artist,
        name: track.title,
        thumbnail: album.coverImage,
        streams: []
      }));
    });
  }, [album, dispatch]);

  const playAll = useCallback(async () => {
    dispatch(QueueActions.clearQueue());
    await addAlbumToQueue();
    dispatch(QueueActions.selectSong(0));
    dispatch(PlayerActions.startPlayback(false));
  }, [addAlbumToQueue, dispatch]);

  const addFavoriteAlbum = useCallback(async () => {
    dispatch(FavoritesActions.addFavoriteAlbum(album));
  }, [album, dispatch]);

  const removeFavoriteAlbum = useCallback(async () => {
    dispatch(FavoritesActions.removeFavoriteAlbum(album));
  }, [album, dispatch]);

  const playlistNames = localPlaylists.data?.map(playlist => playlist.name);

  function getPlaylistTracks() {
    const tracksWithId: PlaylistTrack[] = [];
    album.tracklist?.forEach((track: Track) => tracksWithId.push(safeAddUuid(track)));
    return tracksWithId;
  }

  const addAlbumToPlaylist = useCallback(async (playlistName: string) => {
    const tracksWithId: PlaylistTrack[] = getPlaylistTracks();
    const originalPlaylist = localPlaylists.data?.find(playlist => playlist.name === playlistName);
    const playlistWithAlbumTracks = {
      ...originalPlaylist,
      tracks: [
        ...originalPlaylist.tracks,
        ...tracksWithId
      ]
    };
    dispatch(PlaylistActions.updatePlaylist(playlistWithAlbumTracks));
  }, [album, localPlaylists, dispatch]);

  const addAlbumToNewPlaylist = useCallback(async (playlistName: string) => {
    dispatch(PlaylistActions.addPlaylist(getPlaylistTracks(), playlistName));
  }, [album, dispatch]);


  return {
    album,
    isFavorite,
    searchAlbumArtist,
    addAlbumToDownloads,
    addAlbumToQueue,
    playAll,
    addFavoriteAlbum,
    removeFavoriteAlbum,
    addAlbumToPlaylist,
    playlistNames,
    addAlbumToNewPlaylist
  };
};
