import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { playlistsSelectors } from '../../selectors/playlists';
import { settingsSelector } from '../../selectors/settings';
import { pluginsSelectors } from '../../selectors/plugins';
import * as DownloadsActions from '../../actions/downloads';
import * as FavoritesActions from '../../actions/favorites';
import * as QueueActions from '../../actions/queue';
import * as ToastActions from '../../actions/toasts';
import * as PlaylistsActions from '../../actions/playlists';
import { getTrackArtist, getTrackItem } from '@nuclear/ui/lib';
import { safeAddUuid } from '../../actions/helpers';
import { PlaylistHelper } from '@nuclear/core';
import { TrackPopupStrings } from '@nuclear/ui/lib/components/TrackPopup';
export const useTrackPopupProps = (track, thumb) => {
  const playlists: Array<{name: string}> = useSelector(playlistsSelectors.playlists);
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
    
    playlist.tracks.push(PlaylistHelper.extractTrackData(track));
    dispatch(PlaylistsActions.updatePlaylist(playlist));
    dispatch(ToastActions.info(
      playlistToastTitle,
      `${playlistToastBody} ${playlist.name}.`,
      toastThumb,
      settings
    ));
  }, [track, dispatch, playlistToastTitle, playlistToastBody, toastThumb, settings]);

  const strings: TrackPopupStrings = {
    textAddToQueue: t('add-to-queue'),
    textPlayNow: t('play-now'),
    textPlayNext: t('play-next'),
    textAddToFavorites: t('add-to-favorite'),
    textAddToPlaylist: t('add-to-playlist'),
    textAddToDownloads: t('download')
  };

  return {
    playlists,
    strings,
    onAddToQueue,
    onPlayNext,
    onPlayNow,
    onAddToFavorites,
    onAddToPlaylist,
    onAddToDownloads
  };
};
