import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';

import { Playlist } from '@nuclear/core';
import { GridTrackTable, areTracksEqualByName } from '@nuclear/ui';
import { TrackTableProps } from '@nuclear/ui/lib/components/TrackTable';
import { TrackTableSettings } from '@nuclear/ui/lib/components/TrackTable/types';
import { Track } from '@nuclear/ui/lib/types';
import { Column } from 'react-table';

import { playlistsSelectors } from '../../selectors/playlists';
import * as downloadsActions from '../../actions/downloads';
import * as queueActions from '../../actions/queue';
import * as playerActions from '../../actions/player';
import * as playlistActions from '../../actions/playlists';
import * as favoritesActions from '../../actions/favorites';
import { favoritesSelectors } from '../../selectors/favorites';
import { safeAddUuid } from '../../actions/helpers';

export type TrackTableContainerProps<T extends Track> = TrackTableSettings & {
  tracks: TrackTableProps<T>['tracks'];
  onDelete?: TrackTableProps<T>['onDelete'];
  onReorder?: (indexSource: number, indexDest: number) => void;
  TrackTableComponent?: React.ComponentType<TrackTableProps<T>>;
  customColumns?: TrackTableProps<T>['customColumns'];
  displayAddToDownloads?: boolean;
  displayAddToFavorites?: boolean;
};

function TrackTableContainer<T extends Track>({
  tracks,
  onDelete,
  onReorder,
  TrackTableComponent = GridTrackTable,
  customColumns,
  displayAddToDownloads = true,
  displayAddToFavorites = true,
  ...settings
}: TrackTableContainerProps<T>) {
  const { t } = useTranslation('playlists');
  const dispatch = useDispatch();
  const playlists = useSelector(playlistsSelectors.localPlaylists);
  const favoriteTracks: Track[] = useSelector(favoritesSelectors.tracks);

  const [hoveredTrack, setHoveredTrack] = useState<Track | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    dispatch(favoritesActions.readFavorites());
  }, [dispatch]);

  const isTrackFavorite = (track: Track) =>
    !_.isNil(favoriteTracks.find(t => areTracksEqualByName(t, track)));

  const onAddToQueue = useCallback(
    (track: Track) => dispatch(queueActions.addToQueue(queueActions.toQueueItem(track))),
    [dispatch]
  );

  const onPlayNow = useCallback(
    (track: Track) => dispatch(queueActions.playTrack(null, queueActions.toQueueItem(track))),
    [dispatch]
  );

  const onPlayNext = useCallback(
    (track: Track) => dispatch(queueActions.playNext(queueActions.toQueueItem(track))),
    [dispatch]
  );

  const onPlayAll = useCallback(
    (tracksArr: Track[]) => {
      dispatch(queueActions.clearQueue());
      dispatch(queueActions.addPlaylistTracksToQueue(tracksArr));
      dispatch(queueActions.selectSong(0));
      dispatch(playerActions.startPlayback(false));
    },
    [dispatch]
  );

  const onAddToFavorites = useCallback(
    (track: Track) => dispatch(favoritesActions.addFavoriteTrack(track)),
    [dispatch]
  );

  const onRemoveFromFavorites = useCallback(
    (track: Track) => dispatch(favoritesActions.removeFavoriteTrack(track)),
    [dispatch]
  );

  const onAddToDownloads = useCallback(
    (track: Track) => dispatch(downloadsActions.addToDownloads(null, track)),
    [dispatch]
  );

  const onAddToPlaylist = useCallback(
    (track: Track, playlist: Playlist) => {
      const clonedTrack = { ...safeAddUuid(track) };
      const foundPlaylist = playlists.data?.find(p => p.name === playlist.name);
      if (!foundPlaylist) {
        return;
      }
      const newPlaylist = {
        ...foundPlaylist,
        tracks: [...foundPlaylist.tracks, clonedTrack]
      };
      dispatch(playlistActions.updatePlaylist(newPlaylist));
    },
    [dispatch, playlists]
  );

  const onCreatePlaylist = useCallback(
    (track: Track, { name }: { name: string }) => {
      const clonedTrack = { ...safeAddUuid(track) };
      if ((clonedTrack as any).artist?.name) {
        _.set(clonedTrack, 'artist', (clonedTrack as any).artist.name);
      }
      dispatch(playlistActions.addPlaylist([clonedTrack], name));
    },
    [dispatch]
  );

  const onDragEnd = useCallback<TrackTableProps<Track>['onDragEnd']>(
    result => {
      if (!onReorder) {
        return;
      }
      const { source, destination } = result;
      onReorder(source.index, destination.index);
    },
    [onReorder]
  );

  const popupTranstation = useTranslation('track-popup').t;
  const popupStrings = {
    textAddToQueue: popupTranstation('add-to-queue'),
    textPlayNow: popupTranstation('play-now'),
    textPlayNext: popupTranstation('play-next'),
    textAddToFavorites: popupTranstation('add-to-favorite'),
    textAddToPlaylist: popupTranstation('add-to-playlist'),
    textCreatePlaylist: popupTranstation('create-playlist'),
    textAddToDownloads: popupTranstation('download'),
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
    tracksSelectedLabelPlural: trackTableTranslation('tracks-selected-label-plural'),
    filterInputPlaceholder: trackTableTranslation('filter-input-placeholder')
  };

  const enhancedCustomColumns: Column<T>[] = [
    ...(customColumns || []) as Column<T>[],
    {
      id: 'hoverOverlay',
      Header: '',
      Cell: ({ row }: { row: any }) => {
        const track = row.original as T;
        return (
          <div
            onMouseEnter={(e: React.MouseEvent) => {
              setHoveredTrack(track as unknown as Track);
              setCursorPos({ x: e.pageX, y: e.pageY });
            }}
            onMouseMove={(e: React.MouseEvent) => {
              setCursorPos({ x: e.pageX, y: e.pageY });
            }}
            onMouseLeave={() => setHoveredTrack(null)}
            style={{ cursor: 'pointer' }}
          >
            <div>{(track as unknown as Track).title}</div>
            {/* artist might be an object; use optional chaining */}
            {((track as any).artist && (track as any).artist.name) && (
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {(track as any).artist.name}
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <TrackTableComponent<T>
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
      customColumns={enhancedCustomColumns}
      onAddToQueue={onAddToQueue}
      onPlay={onPlayNow}
      onPlayNext={onPlayNext}
      onPlayAll={onPlayAll}
      onAddToFavorites={displayAddToFavorites ? onAddToFavorites : undefined}
      onRemoveFromFavorites={onRemoveFromFavorites}
      onAddToDownloads={displayAddToDownloads ? onAddToDownloads : undefined}
      onAddToPlaylist={onAddToPlaylist}
      onCreatePlaylist={onCreatePlaylist}
      onDelete={onDelete}
      onDragEnd={onReorder ? onDragEnd : undefined}
      popupActionStrings={popupStrings}
      isTrackFavorite={isTrackFavorite}
    />
  );
}

export default TrackTableContainer;
