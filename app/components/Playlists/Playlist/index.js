import React, { useCallback } from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

const Playlist = ({ playlist, history }) => {
  const { t } = useTranslation('playlists');
  const goToPlaylist = useCallback(() => {
    history.push('/playlist/' + playlist);
  }, [history, playlist]);

  return (
    <div className={styles.playlist_outside_container}>
      <div
        onClick={goToPlaylist}
        className={styles.playlist_container}
      >
        <div>
          <img
            className={styles.playlist_thumbnail}
            src={playlist.tracks[0].thumbnail}
          />
        </div>
        <div className={styles.playlist_info}>
          <h1>{playlist.name}</h1>
          <h3>{t('songs', {total: playlist.tracks.length})}</h3>
        </div>
        <div className={styles.playlist_chevron}>
          <FontAwesome name='angle-right' size='2x' />
        </div>
      </div>
    </div>
  );
};

export default Playlist;
