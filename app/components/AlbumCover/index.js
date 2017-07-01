import React from 'react';

import styles from './styles.css';

import AlbumInfo from './AlbumInfo';
import AlbumOverlay from './AlbumOverlay';

class AlbumCover extends React.Component {

  render() {
    var style = {};

    if (this.props.nameOnly) {
      style = {
        backgroundImage: `url(${this.props.cover})`,
        height: '250px'
      };
    }

    return (
      <div style={style} className={styles.album_cover_container}>
        <AlbumOverlay
          handlePlay={this.props.handlePlay}
        />

        {
          this.props.nameOnly
          ? null
          : <img src={this.props.cover}/>
        }

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
