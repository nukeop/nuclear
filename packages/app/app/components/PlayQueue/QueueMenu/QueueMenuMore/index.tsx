import React, { useCallback } from 'react';
import cx from 'classnames';
import { Dropdown, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Playlist, PlaylistHelper } from '@nuclear/core';
import { getTrackArtists } from '@nuclear/ui';
import { Track } from '@nuclear/ui/lib/types';

import styles from './styles.scss';
import { normalizeTrack } from '../../../../utils';

export const addTrackToPlaylist = (
  updatePlaylist,
  playlist: Playlist,
  track: Track
) => {
  if (track && track.name) {
    updatePlaylist({
      ...playlist,
      tracks: [...playlist.tracks, PlaylistHelper.extractTrackData(track)]
    });
  }
};

export const addQueueToPlaylist = (
  updatePlaylist,
  playlist: Playlist,
  tracks: Track[]
) => {
  const newTracks = tracks.map((track) => {
    return PlaylistHelper.extractTrackData(track);
  });

  updatePlaylist({
    ...playlist,
    tracks: [...playlist.tracks, ...newTracks]
  });
};

export type QueueMenuMoreProps = {
  disabled: boolean;
  updatePlaylist: (playlist: Playlist) => void;
  savePlaylistDialog: React.ReactNode;
  playlists: Playlist[];
  currentItem: Track;
  items: Track[];

  clearQueue: () => void;
  resetPlayer: () => void;
  addToDownloads: (track: Track) => void;
  addFavoriteTrack: (track: Track) => void;
};

export const QueueMenuMore: React.FC<QueueMenuMoreProps> = ({
  disabled,
  savePlaylistDialog,
  updatePlaylist,
  playlists,
  currentItem,
  items,
  clearQueue,
  resetPlayer,
  addToDownloads,
  addFavoriteTrack
}) => {
  const { t } = useTranslation('queue');

  const onClearClick = useCallback(() => {
    clearQueue();
    resetPlayer();
  }, [clearQueue, resetPlayer]);

  const onAddToDownloads = useCallback(() => {
    addToDownloads(currentItem);
  }, [addToDownloads, currentItem]);

  const onAddFavoriteTrack = useCallback(() => {
    if (currentItem.name) {
      addFavoriteTrack(normalizeTrack(currentItem));
    }
  }, [addFavoriteTrack, currentItem]);

  return (
    <Dropdown
      item
      icon='ellipsis vertical'
      data-testid='queue-menu-more-container'
      className={styles.queue_menu_more}
      disabled={disabled}
    >
      <Dropdown.Menu>
        <Dropdown.Header>{t('header')}</Dropdown.Header>
        <Dropdown.Item onClick={onClearClick}>
          <Icon name='trash' />
          {t('clear')}
        </Dropdown.Item>
        {savePlaylistDialog}
        <Dropdown.Item>
          <Dropdown text={t('playlist-add-queue')} className='left'>
            <Dropdown.Menu className={cx('left', styles.playlists_menu)}>
              {playlists?.map((playlist, i) => (
                <Dropdown.Item
                  key={i}
                  onClick={() =>
                    addQueueToPlaylist(updatePlaylist, playlist, items)
                  }
                >
                  <Icon name='music' />
                  {playlist.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item>
        <Dropdown.Divider />

        <Dropdown.Header>{t('header-track')}</Dropdown.Header>
        <Dropdown.Item>
          <Dropdown text={t('playlist-add')} className='left'>
            <Dropdown.Menu className={cx('left', styles.playlists_menu)}>
              {playlists?.map((playlist, i) => (
                <Dropdown.Item
                  key={i}
                  onClick={() =>
                    addTrackToPlaylist(updatePlaylist, playlist, currentItem)
                  }
                >
                  <Icon name='music' />
                  {playlist.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={onAddFavoriteTrack}
          data-testid='queue-menu-more-favorite'
        >
          <Icon name='heart' />
          {t('favorite-add')}
        </Dropdown.Item>
        <Dropdown.Item onClick={onAddToDownloads}>
          <Icon name='download' />
          {t('download')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default QueueMenuMore;
