import React from 'react';

import styles from './styles.css';

import AlbumCoverContainer from '../../../containers/AlbumCoverContainer';
import Header from '../../Header';

var _ = require('lodash');

class ArtistResults extends React.Component {

  renderArtists() {
    if(_.has(this.props.artists, 'results')){
      console.log(this.props.artists.results);
    }
  }

  render() {
    return (
      <div>
        <Header>
          Artist search results:
        </Header>
        <div className={styles.artist_results_container}>
          {this.renderArtists()}
        </div>
      </div>
    );
  }
}

export default ArtistResults;
