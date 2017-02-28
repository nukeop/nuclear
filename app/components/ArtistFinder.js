import React, { Component } from 'react';

import ArtistGrid from './ArtistGrid';
import RealtimeSearchBar from './RealtimeSearchBar';

export default class ArtistFinder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <div style={{width: '100%', height: '100%'}}>
          <RealtimeSearchBar
            handleSearch={this.props.handleArtistSearch}
            resultsLoading={this.props.resultsLoading}
          />
          <ArtistGrid
            artists={this.props.artists}
            goToArtist={this.props.goToArtist}
          />
        </div>
      );
  }
}
