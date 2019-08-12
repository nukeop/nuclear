import React from 'react';
import { withTranslation } from 'react-i18next';

import styles from './styles.scss';

@withTranslation('artist')
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
          {this.props.t('similar')}
        </div>
        {
          this.props.artists.map((artist, index) => {
            return (
              <div key={index} onClick={() => {
                this.artistInfoSearchByName(artist.name);
              }} className={styles.artist_row}>
                <img src={artist.thumbnail} />
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
