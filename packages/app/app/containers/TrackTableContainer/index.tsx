import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';

import { Playlist } from '@nuclear/core';
import { TrackTable, areTracksEqualByName } from '@nuclear/ui';
import { TrackTableProps } from '@nuclear/ui/lib/components/TrackTable';
import { TrackTableSettings } from '@nuclear/ui/lib/components/TrackTable/types';
import { Track } from '@nuclear/ui/lib/types';

import { playlistsSelectors } from '../../selectors/playlists';
import * as downloadsActions from '../../actions/downloads';
import * as queueActions from '../../actions/queue';
import * as playerActions from '../../actions/player';
import * as playlistActions from '../../actions/playlists';
import * as favoritesActions from '../../actions/favorites';
import { favoritesSelectors } from '../../selectors/favorites';
import { safeAddUuid } from '../../actions/helpers';

export type TrackTableContainerProps = TrackTableSettings & {
  tracks: TrackTableProps['tracks'];
  onDelete?: TrackTableProps['onDelete'];
  onReorder?: (indexSource: number, indexDest: number) => void;
};

const TrackTableContainer: React.FC<TrackTableContainerProps> = ({
  tracks,
  onDelete,
  onReorder,
  ...settings
}) => {
  const { t } = useTranslation('playlists');
  const dispatch = useDispatch();
  const playlists = useSelector(playlistsSelectors.localPlaylists);
  const favoriteTracks: Track[] = useSelector(favoritesSelectors.tracks);

  useEffect(() => {
    dispatch(favoritesActions.readFavorites());
  }, [dispatch]);

  const isTrackFavorite = (track: Track) => !_.isNil(favoriteTracks.find(t => areTracksEqualByName(t, track)));

  const onAddToQueue = useCallback((track: Track) => {
    dispatch(queueActions.addToQueue(queueActions.toQueueItem(track)));
  }, [dispatch]);

  const onPlayNow = useCallback((track: Track) => {
    dispatch(queueActions.playTrack(null, queueActions.toQueueItem(track)));
  }, [dispatch]);

  const onPlayNext = useCallback((track: Track) => {
    dispatch(queueActions.playNext(queueActions.toQueueItem(track)));
  }, [dispatch]);

  const onPlayAll = useCallback((tracks: Track[]) => {
    dispatch(queueActions.clearQueue());
    dispatch(queueActions.addPlaylistTracksToQueue(tracks));
    dispatch(queueActions.selectSong(0));
    dispatch(playerActions.startPlayback(false));
  }, [dispatch]);

  const onAddToFavorites = useCallback((track: Track) => {
    dispatch(favoritesActions.addFavoriteTrack(track));
  }, [dispatch]);

  const onRemoveFromFavorites = useCallback((track: Track) => {
    dispatch(favoritesActions.removeFavoriteTrack(track));
  }, [dispatch]);

  const onAddToDownloads = useCallback((track: Track) => {
    dispatch(downloadsActions.addToDownloads(null, track));
  }, [dispatch]);

  const onAddToPlaylist = useCallback((track: Track, playlist: Playlist ) => {
    const clonedTrack = {...safeAddUuid(track)};
    const foundPlaylist = playlists.data?.find(p => p.name === playlist.name);
    const newPlaylist = {
      ...foundPlaylist,
      tracks: [
        ...foundPlaylist.tracks,
        clonedTrack
      ]
    };
    dispatch(playlistActions.updatePlaylist(newPlaylist));
  }, [dispatch, playlists]);

  const onDragEnd = useCallback<TrackTableProps['onDragEnd']>((result) => {
    const { source, destination } = result;
    onReorder(source.index, destination.index);
  }, [onReorder]);

  const popupTranstation = useTranslation('track-popup').t;
  const popupStrings = {
    textAddToQueue: popupTranstation('add-to-queue'),
    textPlayNow: popupTranstation('play-now'),
    textPlayNext: popupTranstation('play-next'),
    textAddToFavorites: popupTranstation('add-to-favorite'),
    textAddToPlaylist: popupTranstation('add-to-playlist'),
    textAddToDownloads: popupTranstation('download')
  };

  const trackTableTranslation = useTranslation('track-table').t;
  const trackTableStrings = {
    addSelectedTracksToQueue: trackTableTranslation('add-selected-tracks-to-queue'),
    addSelectedTracksToDownloads: trackTableTranslation('add-selected-tracks-to-downloads'),
    addSelectedTracksToFavorites: trackTableTranslation('add-selected-tracks-to-favorites'),
    playSelectedTracksNow: trackTableTranslation('play-selected-tracks-now'),
    tracksSelectedLabelSingular: trackTableTranslation('tracks-selected-label-singular'),
    tracksSelectedLabelPlural: trackTableTranslation('tracks-selected-label-plural')
  };

  return <TrackTable
    {...settings}
    tracks={tracks}
    positionHeader={<Icon name='hashtag' />}
    thumbnailHeader={<Icon name='image' />}
    artistHeader={t('artist')}
    titleHeader={t('title')}
    albumHeader={t('album')}
    durationHeader={t('duration')}
    strings={trackTableStrings}
    playlists={playlists.data}
    onAddToQueue={onAddToQueue}
    onPlay={onPlayNow}
    onPlayNext={onPlayNext}
    onPlayAll={onPlayAll}
    onAddToFavorites={onAddToFavorites}
    onRemoveFromFavorites={onRemoveFromFavorites}
    onAddToDownloads={onAddToDownloads}
    onAddToPlaylist={onAddToPlaylist}
    onDelete={onDelete}
    onDragEnd={Boolean(onReorder) && onDragEnd}
    popupActionStrings={popupStrings}

    isTrackFavorite={isTrackFavorite}
  />;
};

export default TrackTableContainer;
