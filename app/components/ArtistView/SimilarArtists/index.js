import React from 'react';

import styles from './styles.scss';

const _ = require('lodash');

class SimilarArtists extends React.Component {
  constructor(props) {
    super(props);
  }

  artistInfoSearch(artistId) {
    this.props.artistInfoSearch(artistId);
    this.props.history.push('/artist/' + artistId);
  }

  render() {
    return (
      <div className={styles.similar_artists_container}>
        <div className={styles.header}>
          Similar artists:
        </div>
        {
          this.props.artists.map(artist => {
            return (
                <div className={styles.artist_row}>
                  <img src={artist.image[1]['#text']} />
                  <div onClick={() => {console.log('discogs search by name')}}>{artist.name}</div>
                </div>
            )
          })
        }
      </div>
    );
  }
}

export default SimilarArtists;
