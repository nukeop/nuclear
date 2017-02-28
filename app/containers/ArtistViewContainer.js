import React, { Component } from 'react';

import ArtistView from '../components/ArtistView';

const lastfm = require('../api/Lastfm');

export default class ArtistViewContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artistDetails: null
    }
  }

  componentDidMount() {
    lastfm.getArtistInfo(this.props.artist.name, (response) => {
      this.setState({artistDetails: response.data.artist});
      console.log(response.data.artist);
    })
  }

  render() {
    return (
      this.state.artistDetails===null
      ? <div style={{lineHeight: '750px', height: '100%', width: '100%', fontSize: '48px'}}><i className='fa fa-spinner fa-pulse fa-fw' /></div>
      : <ArtistView
          artist={this.state.artistDetails}
        />
    );
  }
}
