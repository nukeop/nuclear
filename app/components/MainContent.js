import React, { Component } from 'react';

import AlbumFinderContainer from '../containers/AlbumFinderContainer';
import AlbumViewContainer from '../containers/AlbumViewContainer';
import ArtistFinderContainer from '../containers/ArtistFinderContainer';
import ArtistViewContainer from '../containers/ArtistViewContainer';
import SearchField from './SearchField';
import SongList from './SongList';
import SearchContainer from '../containers/SearchContainer';
import PlaylistsContainer from '../containers/PlaylistsContainer';
import SettingsContainer from '../containers/SettingsContainer';
import styles from './MainContent.css';

const bandcamp = require('../api/Bandcamp');
const enums = require('../api/Enum');
const mb = require('../api/Musicbrainz');
const vimeo = require('../api/Vimeo');
const songFinder = require('../utils/SongFinder');
const soundcloud = require('../api/Soundcloud');
const youtube = require('../api/Youtube');

export default class MainContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songList: [],
      songListLoading: false,
      currentAlbum: null,
      currentArtist: null
    };
  }

  songListChangeCallback(songs) {
    this.setState({songList: songs, songListLoading: false});
  }

  songSearchStartCallback() {
    this.setState({songListLoading: true});
  }

  addAlbumToQueue(album, playNow) {
    mb.musicbrainzLookup(album.mbid, (result) => {
      result.load(['recordings'], () => {

        var tracks = [];
        result.mediums.map((el, i) => {
          tracks = tracks.concat(el.tracks);
        });

        tracks.map((el, i) => {
          var artistName = typeof album.artist === 'object' ? album.artist.name : album.artist;

          songFinder.getTrack(
            artistName,
            el.recording.title,
            el.recording.length,
            (err, track) => {
              if (err) {
                this.props.home.showAlertError(err);
              } else {
                track.data.thumbnail = album.image[2]['#text'];
                if (i===0 && playNow) {
                  this.props.home.playNow(track);
                } else {
                  this.props.home.addToQueue(track);
                }
              }
            }
          );
        });
      });
    });
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

  switchToArtistView(artist){
    this.setState({currentArtist: artist}, () => {
      this.props.home.setState({mainContents: enums.MainContentItemEnum.SINGLE_ARTIST});
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

      if(searchSources.indexOf('vimeo') >= 0) {
        vimeo.vimeoSearch.bind(this)(searchTerms, searchResults, this.songListChangeCallback);
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
            addAlbumToQueue={this.addAlbumToQueue}
            home={this.props.home}
          />
        </div>
      );
      case enums.MainContentItemEnum.SINGLE_ALBUM:
      return (
        <div className={styles.main_content_container}>
          <AlbumViewContainer
            album={this.state.currentAlbum}
            addAlbumToQueue={this.addAlbumToQueue}
            addToDownloads={this.props.addToDownloads}
            addToQueue={this.props.addToQueue}
            home={this.props.home}
          />
        </div>
      );
      case enums.MainContentItemEnum.ARTISTS:
      return (
        <div className={styles.main_content_container}>
          <ArtistFinderContainer
            switchToArtistView={this.switchToArtistView.bind(this)}
            home={this.props.home}
          />
        </div>
      );
      case enums.MainContentItemEnum.SINGLE_ARTIST:
      return (
        <div className={styles.main_content_container}>
          <ArtistViewContainer
            artist={this.state.currentArtist}
            switchToAlbumView={this.switchToAlbumView.bind(this)}
            addAlbumToQueue={this.addAlbumToQueue}
          />
        </div>
      );
      default:
        return(<div className={styles.main_content_container} />);
    }
  }
}
