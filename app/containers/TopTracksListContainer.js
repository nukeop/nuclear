import React, { Component } from 'react';

import TopTracksList from '../components/TopTracksList';

const lastfm = require('../api/Lastfm');
const sc = require('../api/SpotifyCharts');

export default class TopTracksListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topTracks: null
    };
  }

  componentDidMount() {
    sc.getDailyChart((result) => {

      var tracks = [];
      result.slice(0, 10).map((el) => {

        var trackInfo = {
          name: el[1],
          artist: el[2],
          listeners: el[3],
          image: null
        }

        lastfm.getArtistInfo(el[2], (result) => {
           trackInfo.image = result.data.artist.image;
           tracks.push(trackInfo);

           if (tracks.length == 10) {
             this.setState({
               topTracks: tracks.sort((a, b) => {return b.listeners-a.listeners})
             });
           }
        });

      })
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
