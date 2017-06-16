import React from 'react';

import styles from './styles.css';

import AlbumCover from '../AlbumCover';
import AlbumResults from './AlbumResults';
import ArtistResults from './ArtistResults';

class SearchResults extends React.Component {

  render() {
    return (
      <div className={styles.search_results_container}>
        <ArtistResults
          artists={this.props.unifiedSearchResults[0]}
        />
        <AlbumResults
          albums={this.props.unifiedSearchResults[1]}
        />
      </div>
    );
  }
}

export default SearchResults;
