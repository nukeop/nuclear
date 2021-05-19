import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import { Button, ContextPopup, PopupButton, TrackRow } from '@nuclear/ui';
import { TrackRowProps } from '@nuclear/ui/lib/components/TrackRow';

import InputDialog from '../InputDialog';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';
import { Track } from '@nuclear/core';
import TrackPopupContainer from '../../containers/TrackPopupContainer';
import { useHistory } from 'react-router';

export type Playlist = {
  tracks: Track[];
  id: string;
  name: string;
}

export type PlaylistViewProps = {
  playlist: Playlist;
  updatePlaylist: (playlist: Playlist) => void;
  deletePlaylist: (id: string) => void;
  clearQueue: () => void;
  startPlayback: () => void;
  selectSong: (i: number) => void;
  addTracks: (tracks: Track[]) => void;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  updatePlaylist,
  deletePlaylist,
  clearQueue,
  addTracks,
  selectSong,
  startPlayback
}) => {
  const { t } = useTranslation('playlists');
  const history = useHistory();

  const renamePlaylist = (name: string) => {
    const updatedPlaylist = {
      ...playlist,
      name
    };
    updatePlaylist(updatedPlaylist);
  };

  const playAll = () => {
    clearQueue();
    addTracks(playlist.tracks);
    selectSong(0);
    startPlayback();
  };

  const removeTrack = (trackToRemove: Track) => {
    const newPlaylist = {
      ...playlist,
      tracks: playlist.tracks.filter(track => track.uuid !== trackToRemove.uuid)
    };
    updatePlaylist(newPlaylist);
  };

  return (
    <div className={styles.playlist_view_container}>
      <div className={styles.playlist}>
        <div className={styles.playlist_info}>
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
                onAccept={renamePlaylist}
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
            <div className={styles.playlist_buttons}>
              <Button
                onClick={playAll}
                color='pink'
                rounded
                className={styles.play_button}
              >
                <Icon name='play' /> Play
              </Button>

              <ContextPopup
                trigger={
                  <Button
                    basic
                    rounded
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
                  onClick={() => addTracks(playlist.tracks)}
                  ariaLabel={t('queue')}
                  icon='plus'
                  label={t('queue')}
                />
                <PopupButton
                  onClick={() => {
                    deletePlaylist(playlist.id);
                    history.push('/playlists');
                  }}
                  ariaLabel={t('delete')}
                  icon='trash'
                  label={t('delete')}
                />
              </ContextPopup>
            </div>
          </div>
        </div>
        <div className={styles.playlist_tracks}>
          <table>
            <thead>
              <tr>
                <th />
                <th>
                  <Icon name='image outline' />
                </th>
                <th>{t('artist')}</th>
                <th>{t('title')}</th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, index) => <TrackPopupContainer
                key={'playlist-track-row-' + index}
                title={track.name}
                artist={track.artist}
                thumb={track.thumbnail ?? track.thumb}
                withAddToPlaylist={false}
                track={track}
                trigger={
                  <TrackRow
                    track={track as TrackRowProps['track']}
                    displayCover
                    displayArtist
                    withDeleteButton
                    onDelete={() => removeTrack(track)}
                  />
                }
              />)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
