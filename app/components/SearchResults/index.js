import React from 'react';

import styles from './styles.css';

import AlbumCover from '../AlbumCover';

var _ = require('lodash');

class SearchResults extends React.Component {

  renderAlbums(results) {
    var noalbums = 'No albums found.';
    if (results.length == 0) {
      return noalbums;
    } else {
      for (var i = 0; i<results.length; i++) {
        if (_.has(results[i], 'release-groups')) {
          var albums = results[i];
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
      <div className={styles.search_results_container}>
        {this.renderAlbums(this.props.unifiedSearchResults)}
      </div>
    );
  }
}

export default SearchResults;
