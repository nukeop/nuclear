import React from 'react';

import styles from './styles.css';

import AlbumCover from '../../AlbumCover';

var _ = require('lodash');

class AlbumResults extends React.Component {

  renderAlbums(results) {
    var noalbums = 'No albums found.';

    if (this.props.results.length == 0) {
      return noalbums;
    } else {
      for (var i = 0; i<this.props.results.length; i++) {
        if (_.has(this.props.results[i], 'release-groups')) {
          var albums = this.props.results[i];
          if (albums.length == 0) {
            return noalbums;
          } else {
            return albums['release-groups'].map((album, i) => {
              return (
                <AlbumCover
                  key={i}
                  album={{
                    artist: album['artist-credit'][0].artist.name,
                    title: album.title,
                    cover: album.cover
                  }}
                />
              )
            });
          }
        }
      }
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
