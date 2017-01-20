// @flow
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router';
import AlertContainer from 'react-alert';
import Sound from 'react-sound';

import SidebarMenu from './SidebarMenu';
import Navbar from './Navbar';
import QueueBar from './QueueBar';
import SearchField from './SearchField';
import MainContent from './MainContent';
import Player from './Player';
import styles from './Home.css';

var fs = require('fs');
var ytdl = require('ytdl-core');

var SidebarMenuItemEnum = {
  DEFAULT: 0,
  QUEUE: 1
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ytApiKey: "AIzaSyCIM4EzNqi1in22f4Z3Ru3iYvLaY8tc3bo",
      songList: [],
      songListLoading: false,
      queuebarOpen: false,
      songQueue: [],
      playStatus: Sound.status.STOPPED,
      currentSongNumber: 0,
      currentSongUrl: '',
      currentSongPosition: 0,
      seekFromPosition: 0,
      songStreamLoading: false,
      sidebarContents: SidebarMenuItemEnum.DEFAULT
    };

    this.alertOptions = {
          position: 'bottom left',
          theme: 'dark',
          time: 5000,
          transition: 'fade',
        };
  }

  songLoadingCallback(loading) {
    this.setState({songStreamLoading: !loading.loaded});
  }

  songPlayingCallback(playing) {
    var progress = (playing.position/playing.duration)*100.0;

    this.setState({currentSongPosition: playing.position});
  }

  songFinishedPlayingCallback() {
    this.setState({
      currentSongPosition: 0,
      seekFromPosition: 0,
    });

    if (this.state.currentSongNumber==this.state.songQueue.length-1){
      this.setState({playStatus: Sound.status.STOPPED});
    } else {
      this.nextSong();
    }
  }

  nextSong() {
    // We need to update state in two steps - first we update the current song
    // number, then we update the url to reflect the new number.
    this.setState({
      currentSongNumber: Math.min(
        this.state.currentSongNumber+1,
        this.state.songQueue.length
      )});

    this.setState({
      currentSongUrl: this.state.songQueue[this.state.currentSongNumber].data.streamUrl
    });
  }

  prevSong() {
    this.setState({
      currentSongNumber: Math.max(
        this.state.currentSongNumber-1,
        0
      )});
  }

  videoInfoCallback(song, err, info) {
    song.data.streamUrl=info.formats.filter(function(e){return e.itag=='140'})[0].url;
    song.data.streamUrlLoading=false;
    this.setState({songQueue: this.state.songQueue});
  }

  videoInfoThenPlayCallback(song, err, info) {
    this.videoInfoCallback(song, err, info);
    this.togglePlay();
  }

  playNow(song, callback, event) {
    this.setState({
      playStatus: Sound.status.STOPPED,
      songQueue: [],
      currentSongNumber: 0,
      currentSongPosition: 0,
      seekFromPosition: 0,
      songStreamLoading: false
    });

    this.state.songQueue.length = 0;
    this.addToQueue(song, callback, event);
  }

  toggleQueue() {
    this.setState({sidebarContents: SidebarMenuItemEnum.QUEUE});
  }

  sidebarGoBackCallback() {
    this.setState({sidebarContents: ''});
  }

  addToQueue(song, callback, event) {
    if (song.source === 'youtube'){
      if (typeof(callback)==='undefined') callback=this.videoInfoCallback;

      song.data.streamUrlLoading=true;
      ytdl.getInfo(
        `http://www.youtube.com/watch?v=${song.data.id}`,
         callback.bind(this, song)
      );

    }

    this.state.songQueue.push(song);
    this.setState({songQueue: this.state.songQueue});
  }

  songListChangeCallback(songs){
    this.setState({songList: songs, songListLoading: false});
  }

  songSearchStartCallback(){
    this.setState({songListLoading: true});
  }

  ytDurationToStr(ytDuration){
  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0, minutes = 0, seconds = 0, totalseconds;

  if (reptms.test(ytDuration)) {
    var matches = reptms.exec(ytDuration);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
    totalseconds = hours * 3600  + minutes * 60 + seconds;
  }

  if (hours > 0){
    return hours + ":" + minutes + ":" + seconds;
  }
  else {
    return minutes + ":" + seconds;
  }
}

  prepareUrl(url) {
    return `${url}&key=${this.state.ytApiKey}`;
  }

  handleSearch(event, value, searchSources) {
    if (event.key === 'Enter') {
      var _this = this;
      this.state.searchTerms = document.getElementById("searchField").value;
      this.state.songList = [];
      var tempList = [];

      if (searchSources.length < 1) {
        this.showAlertInfo("Please select a source.");
        return;
      }

      _this.songSearchStartCallback();

      if (searchSources.indexOf('youtube') >= 0){
        Axios.get(this.prepareUrl("https://www.googleapis.com/youtube/v3/search?part=id,snippet&maxResults=50&q="+this.state.searchTerms))
        .then(function(response) {
          response.data.items.map(function(el){
            if (el.id.kind === "youtube#video"){

              var newYoutubeItem = {
                source: 'youtube',
                data: {
                  id: el.id.videoId,
                  thumbnail: el.snippet.thumbnails.medium.url,
                  title: el.snippet.title,
                  length: "Unknown",
                  streamUrl: "",
                  streamUrlLoading: false
                }
              };

              Axios.get(_this.prepareUrl("https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails&id="+newYoutubeItem.data.id))
                .then(function(response){
                  newYoutubeItem.data.length = _this.ytDurationToStr(response.data.items[0].contentDetails.duration);
                  tempList.push(newYoutubeItem);

                  _this.songListChangeCallback(tempList);
                  _this.setState({songList: tempList});
                });
            }
          });
        });
      }

    }
  }

  togglePlay(){
    if (this.state.playStatus===Sound.status.PLAYING) {
      this.setState({playStatus: Sound.status.STOPPED});
    } else {
      this.setState({
        playStatus: Sound.status.PLAYING,
        currentSongUrl: this.state.songQueue[this.state.currentSongNumber].data.streamUrl,
        seekFromPosition: this.state.currentSongPosition
      });
    }
  }

  showAlertInfo(text){
    msg.info(text);
  }

  showAlertSuccess(text){
    msg.success(text);
  }

  render() {
    var sidebarContentsRendered = '';
    switch (this.state.sidebarContents) {
      case SidebarMenuItemEnum.DEFAULT:
        break;
      case SidebarMenuItemEnum.QUEUE:
      sidebarContentsRendered = (
        <QueueBar
        queue={this.state.songQueue}
        currentSong={this.state.currentSongNumber}
        />
      );
    }

    return (
      <div>

        {/* <Navbar onClick={this.toggleSidebar}/> */}

        <SidebarMenu
          playStatus={this.state.playStatus}
          togglePlayCallback={this.togglePlay.bind(this)}
          nextSongCallback={this.nextSong.bind(this)}
          prevSongCallback={this.prevSong.bind(this)}
          songStreamLoading={this.state.songStreamLoading}
          toggleQueue={this.toggleQueue.bind(this)}
          goBackCallback={this.sidebarGoBackCallback.bind(this)}
          menu={sidebarContentsRendered}
        />

        <div className={styles.container}>
          <SearchField
            ref="searchField_ref"
            handleSearch={this.handleSearch.bind(this)}
           />
           <MainContent
             songList={this.state.songList}
             songListLoading={this.state.songListLoading}
             addToQueue={this.addToQueue}
             playNow={this.playNow}
             home={this}
           />

           <AlertContainer
             ref={(a) => global.msg = a}
             {...this.alertOptions}
            />
        </div>

        <Sound
          url={this.state.currentSongUrl}
          playStatus={this.state.playStatus}
          onLoading={this.songLoadingCallback.bind(this)}
          onPlaying={this.songPlayingCallback.bind(this)}
          onFinishedPlaying={this.songFinishedPlayingCallback.bind(this)}
          playFromPosition={this.state.seekFromPosition}
        />

      </div>
    );
  }
}
