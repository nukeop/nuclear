import React from 'react';

import styles from './styles.css';

import AlbumInfo from './AlbumInfo';
import AlbumOverlay from './AlbumOverlay';

class AlbumCover extends React.Component {

  render() {
    return (
      <div className={styles.album_cover_container}>
        <AlbumOverlay
          handlePlay={this.props.handlePlay}
        />
        <img src={this.props.cover}/>

        <AlbumInfo
          artist={this.props.artist}
          title={this.props.title}
          nameOnly={this.props.nameOnly}
        />
      </div>
    );
  }
}

export default AlbumCover;
