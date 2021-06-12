import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';
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
import { Playlist } from '../../reducers/playlists';

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
  const playlists: Playlist[] = useSelector(playlistsSelectors.playlists);
  const favoriteTracks: Track[] = useSelector(favoritesSelectors.tracks);

  useEffect(() => {
    dispatch(favoritesActions.readFavorites());
  }, [dispatch]);

  const isTrackFavorite = (track: Track) => !_.isNil(favoriteTracks.find(t => areTracksEqualByName(t, track)));

  const onAddToQueue = useCallback((track: Track) => {
    dispatch(queueActions.addToQueue(track));
  }, [dispatch]);

  const onPlayNow = useCallback((track: Track) => {
    dispatch(queueActions.playTrack(null, track));
  }, [dispatch]);

  const onPlayAll = useCallback((tracks: Track[]) => {
    dispatch(queueActions.clearQueue());
    dispatch(queueActions.addPlaylistTracksToQueue(tracks));
    dispatch(queueActions.selectSong(0));
    dispatch(playerActions.startPlayback());
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
    const foundPlaylist = playlists.find(p => p.name === playlist.name);
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

  return <TrackTable
    {...settings}
    tracks={tracks}
    positionHeader={<Icon name='hashtag' />}
    thumbnailHeader={<Icon name='image' />}
    artistHeader={t('artist')}
    titleHeader={t('title')}
    albumHeader={t('album')}
    durationHeader={t('duration')}
    strings={{
      addSelectedTracksToQueue: 'Add selected to queue',
      addSelectedTracksToDownloads: 'Add selected to downloads',
      addSelectedTracksToFavorites: 'Add selected to favorites',
      playSelectedTracksNow: 'Play selected now',
      tracksSelectedLabelSingular: 'track selected',
      tracksSelectedLabelPlural: 'tracks selected'
    }}
    playlists={playlists}
    onAddToQueue={onAddToQueue}
    onPlay={onPlayNow}
    onPlayAll={onPlayAll}
    onAddToFavorites={onAddToFavorites}
    onRemoveFromFavorites={onRemoveFromFavorites}
    onAddToDownloads={onAddToDownloads}
    onAddToPlaylist={onAddToPlaylist}
    onDelete={onDelete}
    onDragEnd={Boolean(onReorder) && onDragEnd}

    isTrackFavorite={isTrackFavorite}
  />;
};

export default TrackTableContainer;
