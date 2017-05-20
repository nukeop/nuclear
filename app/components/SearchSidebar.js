import React, { Component } from 'react';

import styles from './SearchSidebar.css';

export default class SearchSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.searchResults === null) {
      return null;
    } else {
      console.log(this.props.searchResults);

      return (
        <div className={styles.search_sidebar_container}>
          <div className={styles.search_sidebar}>
            <h3>Artists</h3>
              {
                this.props.searchResults.artists.artist.map((el, i) => {
                  return (
                    <div className={styles.search_sidebar_artist_container}>
                      <img src={el.image[1]['#text']} />
                      <span className={styles.search_sidebar_artist_name}>{el.name}</span>
                    </div>
                  );
                })
              }
            <h3>Songs</h3>
              {
                this.props.searchResults.tracks.track.map((el, i) => {
                  return (
                    <div className={styles.search_sidebar_track_container}>
                      <img src={el.image[1]['#text']} />
                      <div className={styles.search_sidebar_track_info}>
                        <div className={styles.search_sidebar_track_name}>{el.name}</div>
                        <div className={styles.search_sidebar_track_artist}>by {el.artist}</div>
                      </div>
                    </div>
                  );
                })
              }
            <h3>Albums</h3>
              {
                this.props.searchResults.albums.album.map((el, i) => {
                  return (
                    <div className={styles.search_sidebar_album_container}>
                      <img src={el.image[1]['#text']} />
                      <div className={styles.search_sidebar_album_info}>
                        <div className={styles.search_sidebar_album_name}>{el.name}</div>
                        <div className={styles.search_sidebar_album_artist}>by {el.artist}</div>
                      </div>
                    </div>
                  );
                })
              }
          </div>
        </div>
      );
    }
  }
}
