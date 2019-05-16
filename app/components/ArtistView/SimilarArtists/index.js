import React from 'react';

import styles from './styles.scss';

const _ = require('lodash');

class SimilarArtists extends React.Component {
  constructor(props) {
    super(props);
  }

  artistInfoSearchByName(artistName) {
    this.props.artistInfoSearchByName(artistName, this.props.history);
  }

  render() {
    return (
      <div className={styles.similar_artists_container}>
        <div className={styles.header}>
          Similar artists
        </div>
        {
          this.props.artists.map((artist, index) => {
            return (
              <div key={index} onClick={() => {
                this.artistInfoSearchByName(artist.name);
              }} className={styles.artist_row}>
                <img src={artist.image[1]['#text']} />
                <div>{artist.name}</div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default SimilarArtists;
