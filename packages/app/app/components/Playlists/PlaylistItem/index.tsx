import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import { Playlist } from '@nuclear/core/src/helpers/playlist/types';

type PlaylistProps = {
  index: number;
  playlist: Playlist;
}

const PlaylistItem: React.FC<PlaylistProps> = ({ playlist, index }) => {
  const { t } = useTranslation('playlists');
  const history = useHistory();

  const goToPlaylist = () => {
    history.push('/playlist/' + index);
  };

  return (
    <div className={styles.playlist_outside_container}>
      <div
        onClick={goToPlaylist}
        className={styles.playlist_container}
      >
        <div className={styles.playlist_thumbnail_container}>
          <img
            className={styles.playlist_thumbnail}
            src={playlist.tracks[0] ? playlist.tracks[0].thumbnail || String(artPlaceholder) : String(artPlaceholder)}
          />
        </div>
        <div className={styles.playlist_info}>
          <h4 className={styles.playlist_title}>{playlist.name}</h4>
          <p>{t(playlist.tracks.length < 2 ? 'songs': 'songs_plural', {total: playlist.tracks.length})}</p>
        </div>
        
      </div>
    </div>
  );
};

export default PlaylistItem;
