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
import * as blacklistActions from '../../actions/blacklist';
import { favoritesSelectors } from '../../selectors/favorites';
import { safeAddUuid } from '../../actions/helpers';

export type TrackTableContainerProps<T extends Track> = TrackTableSettings & {
  tracks: TrackTableProps<T>['tracks'];
  onDelete?: TrackTableProps<T>['onDelete'];
  onReorder?: (indexSource: number, indexDest: number) => void;
  TrackTableComponent?: React.ComponentType<TrackTableProps<T>>;
  displayAddToDownloads?: boolean;
  displayAddToFavorites?: boolean;
};

function TrackTableContainer<T extends Track> ({
  tracks,
  onDelete,
  onReorder,
  TrackTableComponent = TrackTable,
  displayAddToDownloads = true,
  displayAddToFavorites = true,
  ...settings
}: TrackTableContainerProps<T>) {
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

  const onAddToBlacklist = useCallback((track: Track) => {
    dispatch(blacklistActions.addToBlacklist(track));
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

  const onCreatePlaylist = useCallback(
    (track: Track, { name }: { name: string } ) => {
      const clonedTrack = {...safeAddUuid(track)};
      if (clonedTrack.artist.name) {
        _.set(clonedTrack, 'artist', clonedTrack.artist.name);
      }
      dispatch(playlistActions.addPlaylist([clonedTrack], name));
    },
    [dispatch]
  );

  const onDragEnd = useCallback<TrackTableProps<Track>['onDragEnd']>((result) => {
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
    textCreatePlaylist: popupTranstation('create-playlist'),
    textAddToDownloads: popupTranstation('download'),
    textAddToBlacklist: popupTranstation('blacklist'),
    createPlaylistDialog: {
      title: popupTranstation('create-playlist-dialog-title'),
      placeholder: popupTranstation('create-playlist-dialog-placeholder'),
      accept: popupTranstation('create-playlist-dialog-accept'),
      cancel: popupTranstation('create-playlist-dialog-cancel')
    }
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

  return <TrackTableComponent
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
    onAddToFavorites={Boolean(displayAddToFavorites) && onAddToFavorites}
    onAddToBlacklist={onAddToBlacklist}
    onRemoveFromFavorites={onRemoveFromFavorites}
    onAddToDownloads={Boolean(displayAddToDownloads) && onAddToDownloads}
    onAddToPlaylist={onAddToPlaylist}
    onCreatePlaylist={onCreatePlaylist}
    onDelete={onDelete}
    onDragEnd={Boolean(onReorder) && onDragEnd}
    popupActionStrings={popupStrings}

    isTrackFavorite={isTrackFavorite}
  />;
}

export default TrackTableContainer;
