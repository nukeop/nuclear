import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { PlaylistHelper } from '@nuclear/core';
import { getTrackArtist, getTrackItem } from '@nuclear/ui/lib';
import { TrackPopupStrings } from '@nuclear/ui/lib/components/TrackPopup';

import { settingsSelector } from '../../selectors/settings';
import { pluginsSelectors } from '../../selectors/plugins';
import * as DownloadsActions from '../../actions/downloads';
import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as ToastActions from '../../actions/toasts';
import * as PlaylistsActions from '../../actions/playlists';
import { safeAddUuid } from '../../actions/helpers';
import { useLocalPlaylists } from '../PlaylistsContainer/hooks';
export const useTrackPopupProps = (track, thumb) => {
  const { localPlaylists: playlists } = useLocalPlaylists();
  const settings = useSelector(settingsSelector);
  const plugins: any = useSelector(pluginsSelectors.plugins);

  const streamProviders = track.local ? plugins.streamProviders.filter(({ sourceName }) => {
    return sourceName === 'Local';
  }) : plugins.streamProviders;

  const trackItem = getTrackItem(track);
  const dispatch = useDispatch();

  const onAddToQueue = useCallback(() => dispatch(
    QueueActions.addToQueue(trackItem)
  ), [trackItem, dispatch]);
  
  const onPlayNext = useCallback(() => dispatch(
    QueueActions.playNext(trackItem)
  ), [trackItem, dispatch]);

  const onPlayNow = useCallback(() => dispatch(
    QueueActions.playTrack(streamProviders, trackItem)
  ), [streamProviders, trackItem, dispatch]);

  const toastThumb = React.createElement('img', {src: thumb});
  const { t } = useTranslation('track-popup');
  const artist = getTrackArtist(track);

  const favoriteToastTitle = t('favorite-toast-title');
  const favoriteToastBody = t('favorite-toast-body', {
    artist,
    track: track?.name
  });
  const onAddToFavorites = useCallback(() => {
    dispatch(FavoritesActions.addFavoriteTrack(track));
    dispatch(ToastActions.info(
      favoriteToastTitle,
      favoriteToastBody,
      toastThumb,
      settings
    ));
  }, [dispatch, track, favoriteToastTitle, favoriteToastBody, toastThumb, settings]);

  const downloadToastTitle = t('download-toast-title');
  const downloadToastBody = t('download-toast-body', {
    artist,
    track: track?.name
  });
  const onAddToDownloads = useCallback(() => {
    const clonedTrack = {...safeAddUuid(trackItem)};
    dispatch(DownloadsActions.addToDownloads(streamProviders, clonedTrack));
    dispatch(ToastActions.info(
      downloadToastTitle,
      downloadToastBody,
      toastThumb,
      settings
    ));
  }, [trackItem, dispatch, streamProviders, downloadToastTitle, downloadToastBody, toastThumb, settings]);

  const playlistToastTitle = t('playlist-toast-title');
  const playlistToastBody = t('playlist-toast-body', {
    artist,
    track: track?.name
  });
  const onAddToPlaylist = useCallback((playlist) => {
    const clonedTrack = {...safeAddUuid(track)};
    if (clonedTrack.artist.name) {
      _.set(clonedTrack, 'artist', clonedTrack.artist.name);
    }

    dispatch(PlaylistsActions.updatePlaylist({
      ...playlist,
      tracks: [...playlist.tracks, PlaylistHelper.extractTrackData(clonedTrack)]
    }));
    dispatch(ToastActions.info(
      playlistToastTitle,
      `${playlistToastBody} ${playlist.name}.`,
      toastThumb,
      settings
    ));
  }, [track, dispatch, playlistToastTitle, playlistToastBody, toastThumb, settings]);

  const onCreatePlaylist = useCallback(
    ({ name }: { name: string }) => {
      const clonedTrack = {...safeAddUuid(track)};
      if (clonedTrack.artist.name) {
        _.set(clonedTrack, 'artist', clonedTrack.artist.name);
      }
      dispatch(PlaylistsActions.addPlaylist([PlaylistHelper.extractTrackData(track)], name));
    },
    [dispatch]
  );

  const strings: TrackPopupStrings = {
    textAddToQueue: t('add-to-queue'),
    textPlayNow: t('play-now'),
    textPlayNext: t('play-next'),
    textAddToFavorites: t('add-to-favorite'),
    textAddToPlaylist: t('add-to-playlist'),
    textCreatePlaylist: t('create-playlist'),
    textAddToDownloads: t('download'),
    createPlaylistDialog: {
      title: t('create-playlist-dialog-title'),
      placeholder: t('create-playlist-dialog-placeholder'),
      accept: t('create-playlist-dialog-accept'),
      cancel: t('create-playlist-dialog-cancel')
    }
  };

  return {
    playlists: playlists.data,
    strings,
    onAddToQueue,
    onPlayNext,
    onPlayNow,
    onAddToFavorites,
    onAddToPlaylist,
    onCreatePlaylist,
    onAddToDownloads
  };
};
