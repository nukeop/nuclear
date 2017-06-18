import React from 'react';

import styles from './styles.css';

import AlbumCoverContainer from '../../../containers/AlbumCoverContainer';

var _ = require('lodash');

class AlbumResults extends React.Component {

  renderAlbums() {
    if(_.has(this.props.albums, 'results')){
      return this.props.albums.results.map((el, i) => {
        return (
          <AlbumCoverContainer
            key={i}
            album={el}
            albumIndex={i}
          />
        );
      });
    } else {
      return 'No albums found.'
    }
  }

  render() {
    return (
      <div className={styles.album_results_container}>
        {this.renderAlbums()}
      </div>
    );
  }
}

export default AlbumResults;
