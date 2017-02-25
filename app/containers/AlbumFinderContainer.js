import React, { Component } from 'react';
import AlbumFinder from '../components/AlbumFinder';

const lastfm = require('../api/Lastfm');

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
        addAlbumToQueue={this.props.addAlbumToQueue.bind(this)}
      />
    );
  }
}
