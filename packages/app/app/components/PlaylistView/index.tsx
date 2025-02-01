import React, { useCallback } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Icon } from 'semantic-ui-react';

import { Playlist } from '@nuclear/core';
import { Button, ContextPopup, PopupButton, InputDialog, timestampToTimeString, Tooltip } from '@nuclear/ui';
import { Track } from '@nuclear/ui/lib/types';

import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';
import playlistItemStyles from '../Playlists/PlaylistItem/styles.scss';
import TrackTableContainer from '../../containers/TrackTableContainer';

export type PlaylistViewProps = {
  playlist: Playlist;
  updatePlaylist: (playlist: Playlist) => void;
  addPlaylist: (tracks: Track[], name: string) => void;
  deletePlaylist: (id: string) => void;
  exportPlaylist: (playlist: Playlist, t: TFunction) => void;
  clearQueue: () => void;
  startPlayback: (fromMain: boolean) => void;
  selectSong: (i: number) => void;
  addTracks: (tracks: Playlist['tracks']) => void;
  onReorderTracks: (isource: number, idest: number) => void;
  isExternal?: boolean;
  externalSourceName?: string;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  updatePlaylist,
  addPlaylist,
  deletePlaylist,
  exportPlaylist,
  clearQueue,
  addTracks,
  onReorderTracks,
  selectSong,
  startPlayback,
  isExternal = false,
  externalSourceName
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
    startPlayback(false);
  }, [addTracks, clearQueue, playlist, selectSong, startPlayback]);

  const onDeleteTrack = !isExternal
    ? useCallback((trackToRemove: Track, trackIndex: number) => {
      const newPlaylist = {
        ...playlist,
        tracks: playlist.tracks.filter((_, index) => index !== trackIndex)
      };
      updatePlaylist(newPlaylist);
    }, [playlist, updatePlaylist])
    : undefined;

  const onDeletePlaylist = useCallback(() => {
    deletePlaylist(playlist.id);
    if (history.length > 1) {
      // The current playlist is the top of the navigation stack, go back to the previous view
      history.goBack();
    } else {
      // Fallback in case we can't navigate back to a previous view
      history.push('/playlists');
    }
  }, [playlist, history, deletePlaylist]);

  const onSaveExternalPlaylist = useCallback(() => {
    addPlaylist(playlist.tracks, playlist.name);
    history.push('/playlists');
  }, [playlist]);

  const onExportPlaylist = useCallback(() => {
    exportPlaylist(playlist, t);
  }, [exportPlaylist, playlist, t]);

  return (
    <div 
      data-testid='playlist-view'
      className={styles.playlist_view_container}
    >
      <div className={styles.playlist}>
        <div className={styles.playlist_view_info}>
          <div>
            <img
              className={playlistItemStyles.playlist_thumbnail}
              src={playlist?.tracks?.[0]?.thumbnail ?? artPlaceholder as unknown as string}
            />
          </div>
          <div className={styles.playlist_header}>
            {
              isExternal &&
              <div className={styles.playlist_header_external_source}>
                <Tooltip
                  on='hover'
                  content={t('external-source-tooltip', { source: externalSourceName })}
                  trigger={
                    <div className={styles.playlist_header_external_source_inner}>
                      <Icon name='external square' />
                      {externalSourceName}
                    </div>
                  }
                  position='bottom center'
                />
              </div>
            }
            <div className={styles.playlist_header_inner}>
              <label className={styles.playlist_header_label}>{t('playlist')}</label>
              <div className={styles.playlist_name}>
                {playlist.name}
                <InputDialog
                  header={t('create-playlist-dialog-title')}
                  placeholder={t('dialog-placeholder')}
                  acceptLabel={t('dialog-rename')}
                  cancelLabel={t('dialog-cancel')}
                  initialString={playlist.name}
                  onAccept={onRenamePlaylist}
                  trigger={
                    !isExternal &&
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
                  <Icon name='play' /> {t('play')}
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
                  thumb={playlist?.tracks?.[0]?.thumbnail ?? artPlaceholder as unknown as string}
                >
                  <PopupButton
                    onClick={onAddAll}
                    ariaLabel={t('queue')}
                    icon='plus'
                    label={t('queue')}
                  />
                  {
                    !isExternal &&
                    <PopupButton
                      onClick={onDeletePlaylist}
                      ariaLabel={t('delete')}
                      icon='trash'
                      label={t('delete')}
                    />
                  }
                  {
                    isExternal &&
                    <PopupButton
                      onClick={onSaveExternalPlaylist}
                      ariaLabel={t('save-external-playlist')}
                      icon='save'
                      label={t('save-external-playlist')}
                    />
                  }
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
        </div>
        <TrackTableContainer
          tracks={playlist.tracks as Track[]}
          onDelete={onDeleteTrack}
          onReorder={!isExternal && onReorderTracks}
          displayAlbum={false}
          displayDeleteButton={!isExternal}
          searchable
        />
      </div>
    </div>
  );
};

export default PlaylistView;
