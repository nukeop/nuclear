import Axios from 'axios';
import React, { Component } from 'react';
import Playlists from '../components/Playlists';
import Sound from 'react-sound';

const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const globals = require('../api/Globals');
const ytdl = require('ytdl-core');
const youtube = require('../api/Youtube');


export default class PlaylistsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    };

    fs.readdir(
      path.join(
        globals.directories.userdata,
        globals.directories.playlists
      ),
      (err, items) => {
        items.map((item, i) => {
          var contents = jsonfile.readFileSync(
            path.join(
              globals.directories.userdata,
              globals.directories.playlists,
              item
            )
          );
          this.state.playlists.push({filename: item, contents: contents});
        });
      }
    )
  }

  playlistPlayCallback(playlist, event, value) {
    this.props.home.setState({
      platStatus: Sound.status.STOPPED,
      songQueue: [],
      currentSongNumber: 0,
      currentSongPosition: 0,
      seekFromPosition: 0,
      songStreamLoading: false
    });

    this.props.home.state.songQueue.length = 0;
    playlist.contents.map((el, i) => {

      Axios.get(youtube.prepareUrl("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id="+el.data.id))
      .then((response) => {
        el.data.thumbnail = response.data.items[0].snippet.thumbnails.medium.url;
        el.data.length = youtube.ytDurationToStr(response.data.items[0].contentDetails.duration);
      });

      this.props.home.addToQueue(el, this.props.home.videoInfoCallback, null);
    });
  }

  playlistAddToQueueCallback(playlist, event, value) {
    console.log(playlist);
  }

  playlistRenameCallback(playlist, event, value) {
    console.log(playlist);
  }

  playlistDeleteCallback(playlist, event, value) {
    console.log(playlist);
  }

  render() {
    return(
      <Playlists
        playlists={this.state.playlists}
        playlistPlayCallback={this.playlistPlayCallback.bind(this)}
        playlistAddToQueueCallback={this.playlistAddToQueueCallback.bind(this)}
        playlistRenameCallback={this.playlistRenameCallback.bind(this)}
        playlistDeleteCallback={this.playlistDeleteCallback.bind(this)}
      />
    );
  }
}
