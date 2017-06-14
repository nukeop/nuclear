import React from 'react';

import styles from './styles.css';

class AlbumInfo extends React.Component {

  render() {
    return (
      <div className={styles.album_info_container}>
        <div className={styles.title_container}>{this.props.album.title}</div>
        <div className={styles.artist_container}>{this.props.album.artist}</div>
      </div>
    );
  }
}

export default AlbumInfo;
