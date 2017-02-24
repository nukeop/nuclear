import React, { Component } from 'react';

import AlbumFinderContainer from '../containers/AlbumFinderContainer';
import AlbumViewContainer from '../containers/AlbumViewContainer';
import SearchField from './SearchField';
import SongList from './SongList';
import SearchContainer from '../containers/SearchContainer';
import PlaylistsContainer from '../containers/PlaylistsContainer';
import SettingsContainer from '../containers/SettingsContainer';
import styles from './MainContent.css';

const bandcamp = require('../api/Bandcamp');
const enums = require('../api/Enum');
const mp3monkey = require('../api/Mp3monkey');
const soundcloud = require('../api/Soundcloud');
const youtube = require('../api/Youtube');

export default class MainContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songList: [],
      songListLoading: false,
      currentAlbum: null
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

  switchToAlbumView(album){
    this.setState({currentAlbum: album}, () => {
      this.props.home.setState({mainContents: enums.MainContentItemEnum.SINGLE_ALBUM});
    });
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

      if(searchSources.indexOf('bandcamp') >= 0) {
        bandcamp.bandcampSearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
      }

      if(searchSources.indexOf('mp3monkey') >= 0) {
        mp3monkey.mp3monkeySearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
      }
    }

    return false;
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
      case enums.MainContentItemEnum.SETTINGS:
      return (
        <div className={styles.main_content_container}>
          <SettingsContainer
          />
        </div>
      );
      case enums.MainContentItemEnum.ALBUMS:
      return (
        <div className={styles.main_content_container}>
          <AlbumFinderContainer
            switchToAlbumView={this.switchToAlbumView.bind(this)}
            home={this.props.home}
          />
        </div>
      );
      case enums.MainContentItemEnum.SINGLE_ALBUM:
      return (
        <div className={styles.main_content_container}>
          <AlbumViewContainer
            album={this.state.currentAlbum}
            home={this.props.home}
          />
        </div>
      );
      default:
        return(<div className={styles.main_content_container} />);
    }
  }
}
