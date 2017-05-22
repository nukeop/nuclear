import React, { Component } from 'react';

import SearchSidebarItem from './SearchSidebarItem';

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
                    <SearchSidebarItem
                      thumbnail={el.image[1]['#text']}
                      name={el.name}
                    />
                  );
                })
              }
            <h3>Songs</h3>
              {
                this.props.searchResults.tracks.track.map((el, i) => {
                  return (
                    <SearchSidebarItem
                      thumbnail={el.image[1]['#text']}
                      name={el.name}
                      artist={el.artist}
                    />
                  );
                })
              }
            <h3>Albums</h3>
              {
                this.props.searchResults.albums.album.map((el, i) => {
                  return (
                    <SearchSidebarItem
                      thumbnail={el.image[1]['#text']}
                      name={el.name}
                      artist={el.artist}
                    />
                  );
                })
              }
          </div>
        </div>
      );
    }
  }
}
