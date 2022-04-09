import React, { useCallback } from 'react';
import _ from 'lodash';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Icon } from 'semantic-ui-react';

import { Playlist } from '@nuclear/core';
import { Button, ContextPopup, PopupButton, timestampToTimeString } from '@nuclear/ui';
import { Track } from '@nuclear/ui/lib/types';

import InputDialog from '../InputDialog';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';
import TrackTableContainer from '../../containers/TrackTableContainer';

export type PlaylistViewProps = {
  playlist: Playlist;
  updatePlaylist: (playlist: Playlist) => void;
  deletePlaylist: (id: string) => void;
  exportPlaylist: (playlist: Playlist, t: TFunction) => void;
  clearQueue: () => void;
  startPlayback: () => void;
  selectSong: (i: number) => void;
  addTracks: (tracks: Playlist['tracks']) => void;
  onReorderTracks: (isource: number, idest: number) => void;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  updatePlaylist,
  deletePlaylist,
  exportPlaylist,
  clearQueue,
  addTracks,
  onReorderTracks,
  selectSong,
  startPlayback
}) => {
  const { t, i18n } = useTranslation('playlists');
  const history = useHistory();

  const onRenamePlaylist = useCallback((name: string) => {
    const updatedPlaylist = {
      ...playlist,
      name
    };
    updatePlaylist(updatedPlaylist);
  }, [playlist, updatePlaylist]);

  const onAddAll = useCallback(() => addTracks(playlist.tracks),
    [addTracks, playlist]);

  const onPlayAll = useCallback(() => {
    clearQueue();
    addTracks(playlist.tracks);
    selectSong(0);
    startPlayback();
  }, [addTracks, clearQueue, playlist, selectSong, startPlayback]);

  const onDeleteTrack = useCallback((trackToRemove: Track, trackIndex: number) => {
    const newPlaylist = {
      ...playlist,
      tracks: playlist.tracks.filter((_, index) => index !== trackIndex)
    };
    updatePlaylist(newPlaylist);
  }, [playlist, updatePlaylist]);

  const onDeletePlaylist = useCallback(() => {
    deletePlaylist(playlist.id);
    history.push('/playlists');
  }, [playlist, history, deletePlaylist]);

  const onExportPlaylist = useCallback(() => {
    exportPlaylist(playlist, t);
  }, [exportPlaylist, playlist, t]);

  return (
    <div className={styles.playlist_view_container}>
      <div className={styles.playlist}>
        <div className={styles.playlist_view_info}>
          <div>
            <img
              className={styles.playlist_thumbnail}
              src={_.get(playlist, 'tracks[0].thumbnail', artPlaceholder)}
            />
          </div>
          <div className={styles.playlist_header}>
            <label className={styles.playlist_header_label}>Playlist</label>
            <div className={styles.playlist_name}>
              {playlist.name}
              <InputDialog
                header={<h4>Input new playlist name:</h4>}
                placeholder={t('dialog-placeholder')}
                accept='Rename'
                initialString={playlist.name}
                onAccept={onRenamePlaylist}
                trigger={
                  <Button
                    basic
                    aria-label={t('rename')}
                    icon='pencil'
                    data-testid='rename-button'
                  />
                }
              />
            </div>
            <div className={styles.playlist_details}>
              <span>
                {`${playlist.tracks.length} ${t('number-of-tracks')}`}
              </span>
              {
                playlist.lastModified &&
                  <>
                    <span>
                      ·
                    </span>

                    <span>
                      {`${t('modified-at')}${timestampToTimeString(playlist.lastModified, i18n.language)}`}
                    </span>
                  </>
              }
            </div>
            <div className={styles.playlist_buttons}>
              <Button
                onClick={onPlayAll}
                color='pink'
                circular
                className={styles.play_button}
              >
                <Icon name='play' /> Play
              </Button>

              <ContextPopup
                trigger={
                  <Button
                    basic
                    circular
                    data-testid='more-button'
                    className={styles.more_button}
                  >
                    <Icon name='ellipsis horizontal' />
                  </Button>
                }
                artist={null}
                title={playlist.name}
                thumb={_.get(playlist, 'tracks[0].thumbnail', artPlaceholder)}
              >
                <PopupButton
                  onClick={onAddAll}
                  ariaLabel={t('queue')}
                  icon='plus'
                  label={t('queue')}
                />
                <PopupButton
                  onClick={onDeletePlaylist}
                  ariaLabel={t('delete')}
                  icon='trash'
                  label={t('delete')}
                />
                <PopupButton
                  onClick={onExportPlaylist}
                  ariaLabel={t('export-button')}
                  icon='download'
                  label={t('export-button')}
                />
              </ContextPopup>
            </div>
          </div>
        </div>
        <TrackTableContainer
          tracks={playlist.tracks as Track[]}
          onDelete={onDeleteTrack}
          onReorder={onReorderTracks}
          displayAlbum={false}
        />
      </div>
    </div>
  );
};

export default PlaylistView;
