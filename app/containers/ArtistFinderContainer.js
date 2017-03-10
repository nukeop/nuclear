import React, { Component } from 'react';

import ArtistFinder from '../components/ArtistFinder';

const lastfm = require('../api/Lastfm');

export default class ArtistFinderContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resultsLoading: false,
      searchResults: []
    };
  }

  goToArtist(artist) {
    this.props.switchToArtistView(artist.name);
  }

  handleArtistSearch(event, value) {
    this.setState({resultsLoading: true}, () => {
      lastfm.artistSearch(event.target.value, (response) => {
        this.setState({
          resultsLoading: false,
          searchResults: response.data.results.artistmatches.artist
        });
      });
    });
  }

  render() {
    return (
      <ArtistFinder
        handleArtistSearch={this.handleArtistSearch.bind(this)}
        resultsLoading={this.state.resultsLoading}
        artists={this.state.searchResults}
        goToArtist={this.goToArtist.bind(this)}
      />
    );
  }
}
