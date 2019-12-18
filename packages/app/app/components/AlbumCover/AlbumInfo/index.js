import React from 'react';

import styles from './styles.scss';

const AlbumInfo = ({ artist, title }) => (
  <div className={styles.album_info_container}>
    {this.props.nameOnly ? (
      <div className={styles.title_container}>{artist}</div>
    ) : (
      <div className={styles.title_container}>{title}</div>
    )}

    {!this.props.nameOnly ? (
      <div className={styles.artist_container}>{artist}</div>
    ) : null}
  </div>
);

export default AlbumInfo;
