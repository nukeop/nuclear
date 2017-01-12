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


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ytApiKey: "AIzaSyCIM4EzNqi1in22f4Z3Ru3iYvLaY8tc3bo",
      songList: [],
      songListLoading: false,
      songQueue: [],
      playStatus: Sound.status.STOPPED,
      currentSongUrl: ''
    };

    this.alertOptions = {
          position: 'bottom left',
          theme: 'dark',
          time: 5000,
          transition: 'fade',
        };
  }

  componentWillMount() {
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar() {
    this.refs.sidebar_menu.toggleSidebar();
  }

  videoInfoCallback(song, err, info){
    song.data.streamurl=info.formats.filter(function(e){return e.itag=='140'})[0].url;
    song.data.streamurlloading=false;
    this.setState({songQueue: this.state.songQueue});
  }

  videoInfoThenPlayCallback(song, err, info){
    this.setState({playStatus: Sound.status.STOPPED});
    this.videoInfoCallback(song, err, info);
    this.togglePlay();
  }

  playNow(song, callback, event){
    this.setState({songQueue: []});
    this.state.songQueue.length = 0;
    this.addToQueue(song, callback, event);
  }

  addToQueue(song, callback, event){
    if (song.source === 'youtube'){
      if (typeof(callback)==='undefined') callback=this.videoInfoCallback;

      song.data.streamurlloading=true;
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
      //console.log(this.state.songList);
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
                  streamurl: "",
                  streamurlloading: false
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
      this.setState({playStatus: Sound.status.PLAYING});
      this.setState({currentSongUrl: this.state.songQueue[0].data.streamurl});
    }
  }

  showAlertInfo(text){
    msg.info(text);
  }

  showAlertSuccess(text){
    msg.success(text);
  }

  render() {
    return (
      <div>

        <Navbar onClick={this.toggleSidebar}/>

        <SidebarMenu ref="sidebar_menu" />

        <QueueBar
          ref="queue_bar"
          queue={this.state.songQueue}
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

        <Player
          playStatus={this.state.playStatus}
          togglePlayCallback={this.togglePlay.bind(this)}
        />

        <Sound
          url={this.state.currentSongUrl}
          playStatus={this.state.playStatus}
        />

      </div>
    );
  }
}
