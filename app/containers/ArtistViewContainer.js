import React, { Component } from 'react';

import ArtistView from '../components/ArtistView';

const lastfm = require('../api/Lastfm');

export default class ArtistViewContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artistDetails: null,
      artistTopTracks: null,
      artistTopAlbums: null
    }
  }

  goToAlbum(album) {
    this.props.switchToAlbumView(album);
  }

  componentDidMount() {
    lastfm.getArtistInfo(this.props.artist, (response) => {
      this.setState({artistDetails: response.data.artist});
    });

    lastfm.getArtistTopAlbums(this.props.artist, (response) => {
      this.setState({artistTopAlbums: response.data.topalbums.album});
    });

    lastfm.getArtistTopTracks(this.props.artist, (response) => {
      response.data.toptracks.track.slice(0, 5).map((el, i) => {
        lastfm.getTrackInfo(this.props.artist, el.name, (responseTrack) => {

          if (responseTrack.data.track.album != undefined) {
            el.albumCover = responseTrack.data.track.album.image[0]['#text'];
          } else {
            el.albumCover = this.state.artistDetails.image[0]['#text'];
          }

          if (i===4) {
            this.setState({artistTopTracks: response.data.toptracks.track});
          }
        });
      });
    });

  }

  render() {
    return (
      Object.keys(this.state).some((key) => {return (this.state[key] === null);})
      ? <div style={{lineHeight: '750px', height: '100%', width: '100%', fontSize: '48px'}}><i className='fa fa-spinner fa-pulse fa-fw' /></div>
      : <ArtistView
          artist={this.state.artistDetails}
          artistTopTracks={this.state.artistTopTracks}
          artistTopAlbums={this.state.artistTopAlbums}
          goToAlbum={this.goToAlbum.bind(this)}
          addAlbumToQueue={this.props.addAlbumToQueue.bind(this)}
        />
    );
  }
}
