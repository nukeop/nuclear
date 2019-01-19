import React from 'react';

import styles from './styles.css';

class AlbumInfo extends React.Component {

  render() {
    return (
      <div className={styles.album_info_container}>
        {
          this.props.nameOnly
            ?(
              <div className={styles.title_container}>{this.props.artist}</div>
            )
            : <div className={styles.title_container}>{this.props.title}</div>
        }

        {
          !this.props.nameOnly
            ? <div className={styles.artist_container}>{this.props.artist}</div>
            : null
        }
      </div>
    );
  }
}

export default AlbumInfo;
