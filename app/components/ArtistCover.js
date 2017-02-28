import React, { Component } from 'react';

import styles from './ArtistCover.css';

export default class ArtistCover extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.artist_cover_container}>
        <img style={{width: '170px', height: '170px'}} src={this.props.artist.image[2]['#text']} />
        <div className={styles.artist_cover_artist_name}>
          <a href='#' onClick={this.props.goToArtist}>{this.props.artist.name}</a>
        </div>
      </div>
    );
  };
}
