import React from 'react';

import styles from './styles.css';

import AlbumCoverContainer from '../../../containers/AlbumCoverContainer';
import Header from '../../Header';

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
      <div>
        <Header>
          Album search results:
        </Header>
        <div className={styles.album_results_container}>
          {this.renderAlbums()}
        </div>
      </div>
    );
  }
}

export default AlbumResults;
