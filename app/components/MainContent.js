import React, { Component } from 'react';

import SearchField from './SearchField';
import SongList from './SongList';
import SearchContainer from '../containers/SearchContainer';
import PlaylistsContainer from '../containers/PlaylistsContainer';
import styles from './MainContent.css';

const enums = require('../api/Enum');
const soundcloud = require('../api/Soundcloud');
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

  searchRelated(song) {
    var searchResults = [];

    this.songSearchStartCallback();
    youtube.youtubeRelatedSearch.bind(this)(song.data.id, searchResults, this.songListChangeCallback);
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

      this.songSearchStartCallback();

      if (searchSources.indexOf('youtube') >= 0){
        youtube.youtubeVideoSearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
      }

      if (searchSources.indexOf('youtube playlists') >= 0) {
        youtube.youtubePlaylistSearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
      }

      if(searchSources.indexOf('soundcloud') >= 0) {
        soundcloud.soundcloudSearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
      }
    }
  }

  render() {
    switch (this.props.contents) {
      case enums.MainContentItemEnum.PLAYLISTS:
        return (
          <div className={styles.main_content_container}>
            <PlaylistsContainer
              home={this.props.home}
            />
          </div>
        );
        break;
      case enums.MainContentItemEnum.SEARCH:
        return (
          <div className={styles.main_content_container}>
            <SearchContainer
              handleSearch={this.handleSearch.bind(this)}
              searchRelated={this.searchRelated.bind(this)}
              songList={this.state.songList}
              addToQueue={this.props.addToQueue}
              addToDownloads={this.props.addToDownloads}
              playNow={this.props.playNow}
              home={this.props.home}
              songListLoading={this.state.songListLoading}
            />
          </div>
        );
      default:
        return(<div className={styles.main_content_container} />);
    }
  }
}
