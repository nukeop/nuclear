import React from 'react';

import styles from './styles.css';

import AlbumCover from '../AlbumCover';
import AlbumResults from './AlbumResults';

var _ = require('lodash');

class SearchResults extends React.Component {

  render() {
    return (
      <div className={styles.search_results_container}>
        <AlbumResults
          results={this.props.unifiedSearchResults}
        />
      </div>
    );
  }
}

export default SearchResults;
