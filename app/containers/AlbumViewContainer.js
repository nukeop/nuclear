import React, { Component } from 'react';

import AlbumView from '../components/AlbumView';

const mb = require('../api/Musicbrainz');
const yt = require('../api/Youtube');

export default class AlbumViewContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      release: null
    };
  }

  componentDidMount() {
    mb.musicbrainzLookup(this.props.album.mbid, (result) => {
      result.load(['recordings'], () => {
        var totalSeconds = result.mediums[0].tracks.reduce((a, b)=>a.length+b.length, 0)/1000;
        result.minutes = Math.floor(totalSeconds/60);
        result.seconds = Math.floor(totalSeconds - Math.floor(totalSeconds/60)*60)
        this.setState({release: result});
      });
    });
  }

  playTrack(track, event, value) {
    track.recording.load(['artists'], () => {
      var fullTitle = track.recording.artistCredits[0].artist.name+ ' - '+ track.recording.title;
      yt.youtubeTrackSearch(fullTitle, (response) => {
        response.data.items.map((el, i) => {
          if (el.snippet.title === fullTitle) {
            console.log(el);
            var newItem = {
              source: 'youtube',
              data: {
                id: el.id.videoId,
                thumbnail: el.snippet.thumbnails.medium.url,
                title: fullTitle,
                length: "Unknown",
                streamUrl: "",
                streamUrlLoading: false,
                streamLength: 0
              }
            };

            yt.youtubeFetchVideoDetails(newItem, () => {
              this.props.home.playNow(newItem);
              return;
            });

          }
        });
      });
    });

  }

  render() {
    return (

        this.state.release===null
        ? <div style={{height: '100%', width: '100%', top: 0, bottom: 0, left: 0, right: 0, fontSize: '48px', verticalAlignment: 'middle'}}><i className='fa fa-spinner fa-pulse fa-fw' /></div>
        : <AlbumView
          album={this.props.album}
          release={this.state.release}
          playTrack={this.playTrack.bind(this)}
         />


    );
  }
}
