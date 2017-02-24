import React, { Component } from 'react';
import AlbumFinder from '../components/AlbumFinder';

const lastfm = require('../api/Lastfm');
const mb = require('../api/Musicbrainz');
const songFinder = require('../utils/SongFinder');

export default class AlbumFinderContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerms: '',
      searchResults: [],
      resultsLoading: false
    };
  }

  goToAlbum(album) {
    this.props.switchToAlbumView(album);
  }

  playAlbum(album) {
    mb.musicbrainzLookup(album.mbid, (result) => {
      result.load(['recordings'], () => {

        var tracks = [];
        result.mediums.map((el, i) => {
          tracks = tracks.concat(el.tracks);
        });

        tracks.map((el, i) => {
          songFinder.getTrack(
            album.artist,
            el.recording.title,
            (track) => {
              if (i===0) {
                this.props.home.playNow(track);
              } else {
                this.props.home.addToQueue(track);
              }

            }
          );
        });
      });
    });
  }

  handleAlbumSearch(event, value) {

    var searchTerms = event.target.value;
    this.setState({searchTerms: searchTerms, resultsLoading: true, searchResults: []}, () => {

      lastfm.albumSearch(searchTerms, (response) => {

        this.setState({resultsLoading: false, searchResults: response.data.results.albummatches.album});
      });

    });

  }

  render() {
    return (
      <AlbumFinder
        handleAlbumSearch={this.handleAlbumSearch.bind(this)}
        searchTerms={this.state.searchTerms}
        resultsLoading={this.state.resultsLoading}
        albums={this.state.searchResults}
        goToAlbum={this.goToAlbum.bind(this)}
        playAlbum={this.playAlbum.bind(this)}
      />
    );
  }
}
