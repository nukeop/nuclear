import React from 'react';

import styles from './styles.css';

import AlbumCover from '../../AlbumCover';

var _ = require('lodash');

class AlbumResults extends React.Component {

  renderAlbums() {
    if(_.has(this.props.albums, 'results')){
      return this.props.albums.results.map((el, i) => {
        return (
          <AlbumCover
            key={i}
            artist={el.title.split('-')[0]}
            title={el.title.split('-')[1]}
            cover={el.thumb}
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
