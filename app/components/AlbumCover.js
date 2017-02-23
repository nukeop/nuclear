import React, { Component } from 'react';

import styles from './AlbumCover.css';

export default class AlbumCover extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.album_cover_container}>
        <div className={styles.album_cover_img_container}>
          <img style={{width: '170px', height: '170px'}} src={this.props.album.image[2]['#text']} />
          <div className={styles.album_cover_overlay}>
            <div className={styles.album_cover_play_button_container}>
              <button className={styles.album_cover_play_button} onClick={this.props.playAlbum}>
                   <i style={{paddingLeft: '6px', paddingTop: '8px'}} className="fa fa-play" />
              </button>
            </div>
          </div>

        </div>
        <div className={styles.album_name}><a href='#' onClick={this.props.goToAlbum}>{this.props.album.name}</a></div>
        <div className={styles.artist_name}>{this.props.album.artist}</div>
      </div>
    );
  }
}
