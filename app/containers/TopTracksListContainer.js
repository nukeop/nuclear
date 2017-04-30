import React, { Component } from 'react';

import TopTracksList from '../components/TopTracksList';

const lastfm = require('../api/Lastfm');

export default class TopTracksListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topTracks: null
    };
  }

  componentDidMount() {
    lastfm.getTopTracks((result) => {
      this.setState({topTracks: result.data.tracks.track});
      console.log(result.data.tracks.track);
    });
  }

  render() {
    return (
      this.state.topTracks===null
      ? <div style={{lineHeight: '750px', height: '100%', width: '100%', fontSize: '48px'}}><i className='fa fa-spinner fa-pulse fa-fw' /></div>
      : <TopTracksList
        topTracks={this.state.topTracks}
      />
    );
  }
}
