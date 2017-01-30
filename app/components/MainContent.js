import React, { Component } from 'react';

import SearchField from './SearchField';
import SongList from './SongList';
import styles from './MainContent.css';

const youtube = require('../api/Youtube');

export default class MainContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songList: [],
      songListLoading: false
    };
  }

  songListChangeCallback(songs) {
    this.setState({songList: songs, songListLoading: false});
  }

  songSearchStartCallback() {
    this.setState({songListLoading: true});
  }

  handleSearch(event, value, searchSources) {
    if (event.key === 'Enter') {
      var _this = this;
      var searchTerms = document.getElementById("searchField").value;
      this.setState({songList: []});
      var searchResults = [];

      if (searchSources.length < 1) {
        this.props.home.showAlertInfo("Please select a source.");
        return;
      }

      _this.songSearchStartCallback();

      if (searchSources.indexOf('youtube') >= 0){
        youtube.youtubeVideoSearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
      }

      if (searchSources.indexOf('youtube playlists') >= 0) {
        youtube.youtubePlaylistSearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
      }
    }
  }

  render() {
    return(
      <div className={styles.main_content_container}>
        <SearchField
          handleSearch={this.handleSearch.bind(this)}
        />

        {!this.state.songListLoading ?
          (<SongList
            songList={this.state.songList}
            addToQueue={this.props.addToQueue}
            addToDownloads={this.props.addToDownloads}
            playNow={this.props.playNow}
            home={this.props.home}
          />) :
          (<div className="content-loading">
            <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div>)
        }
      </div>
    );
  }
}
