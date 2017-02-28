import React, { Component } from 'react';

import AlbumView from '../components/AlbumView';

const mb = require('../api/Musicbrainz');
const songFinder = require('../utils/SongFinder');

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

  findTrack(track, callback) {
    songFinder.getTrack(
      track.recording.artistCredits[0].artist.name,
      track.recording.title,
      track.length,
      (err, track) => {
        if (err) {
          this.props.home.showAlertError(err);
        } else {
          callback(track);
        }
      }
    );
  }

  playTrack(track, event, value) {
    track.recording.load(['artists'], () => {
      this.findTrack(track, this.props.home.playNow.bind(this.props.home));
    });
  }

  addTrackToQueue(track) {
    track.recording.load(['artists'], () => {
      this.findTrack(track, this.props.home.addToQueue.bind(this.props.home));
    });
  }

  downloadTrack(track) {
    track.recording.artistCredits = [{artist: {name: this.props.album.artist}}];
    this.findTrack(track, this.props.addToDownloads);
  }

  downloadAlbum(album) {
    this.state.release.load(['recordings', 'artists'], () => {
      var tracks = [];
      this.state.release.mediums.map((el, i) => {
        tracks = tracks.concat(el.tracks);
      });

      tracks.map((el, i) => {
        el.recording.artistCredits = [{artist: {name: this.props.album.artist}}];
        this.findTrack(el, this.props.addToDownloads);
      });
    });
  }

  render() {
    return (

        this.state.release===null
        ? <div style={{lineHeight: '750px', height: '100%', width: '100%', fontSize: '48px'}}><i className='fa fa-spinner fa-pulse fa-fw' /></div>
        : <AlbumView
            album={this.props.album}
            release={this.state.release}
            playTrack={this.playTrack.bind(this)}
            addAlbumToQueue={this.props.addAlbumToQueue.bind(this)}
            downloadAlbum={this.downloadAlbum.bind(this, this.props.album)}
            addToDownloads={this.downloadTrack.bind(this)}
            addToQueue={this.addTrackToQueue.bind(this)}
         />

    );
  }
}
