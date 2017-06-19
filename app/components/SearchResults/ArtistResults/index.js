import React from 'react';

import styles from './styles.css';

import ArtistPicContainer from '../../../containers/ArtistPicContainer';
import Header from '../../Header';

var _ = require('lodash');

class ArtistResults extends React.Component {

  renderArtists() {
    if(_.has(this.props.artists, 'results')){
      return this.props.artists.results.map((el, i) => {
        return (
          <ArtistPicContainer
            key={i}
            artist={el}
            name={el.title}
            cover={el.thumb}
            artistIndex={i}
          />
        );
      });
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
