import React from 'react';

import styles from './styles.scss';

type AlbumInfoProps = {
  nameOnly: boolean;
  artist: string;
  title: string;
}

const AlbumInfo: React.FC<AlbumInfoProps> = ({ artist, title, nameOnly }) => (
  <div className={styles.album_info_container}>
    {nameOnly ? (
      <div className={styles.title_container}>{artist}</div>
    ) : (
      <div className={styles.title_container}>{title}</div>
    )}

    {!nameOnly ? (
      <div className={styles.artist_container}>{artist}</div>
    ) : null}
  </div>
);

export default AlbumInfo;
