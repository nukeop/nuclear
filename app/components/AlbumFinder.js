import React, { Component } from 'react';
import DebounceInput from 'react-debounce-input';

import AlbumGrid from './AlbumGrid';
import RealtimeSearchBar from './RealtimeSearchBar';

export default class AlbumFinder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <RealtimeSearchBar
          handleSearch={this.props.handleAlbumSearch}
          resultsLoading={this.props.resultsLoading}
        />

        <AlbumGrid
          searchTerms={this.props.searchTerms}
          albums={this.props.albums}
          goToAlbum={this.props.goToAlbum}
          addAlbumToQueue={this.props.addAlbumToQueue}
        />
      </div>
    );
  }
}
