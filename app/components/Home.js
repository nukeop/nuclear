// @flow
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router';
import AlertContainer from 'react-alert';
import Sound from 'react-sound';

import SidebarMenu from './SidebarMenu';
import Navbar from './Navbar';
import QueueBar from './QueueBar';
import DownloadQueue from './DownloadQueue';
import MainContent from './MainContent';
import Player from './Player';
import styles from './Home.css';

const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');

const bandcamp = require('../api/Bandcamp');
const enums = require('../api/Enum');
const globals = require('../api/Globals');
const lastfm = require('../api/Lastfm');
const settingsApi = require('../api/SettingsApi');
const songInfo = require('../api/SongInfo');
const youtube = require('../api/Youtube');


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queuebarOpen: false,
      songQueue: [],
      downloadQueue: [],
      playStatus: Sound.status.STOPPED,
      currentSongNumber: 0,
      currentSongUrl: '',
      currentSongPosition: 0,
      currentSongDuration: 0,
      currentSongProgress: 0,
      seekFromPosition: 0,
      songStreamLoading: false,
      sidebarContents: enums.SidebarMenuItemEnum.DEFAULT,
      mainContents: enums.MainContentItemEnum.SEARCH
    };

    this.alertOptions = {
          position: 'bottom right',
          theme: 'dark',
          time: 5000,
          transition: 'fade',
        };
  }

  seekFrom(percent) {
    this.setState({
      seekFromPosition: percent * this.state.currentSongDuration
    });
  }

  songLoadingCallback(loading) {
    this.setState({songStreamLoading: !loading.loaded});
  }

  songPlayingCallback(playing) {
    var progress = Math.round((playing.position/playing.duration)*100.0);

    this.setState({
      currentSongPosition: playing.position,
      currentSongDuration: playing.duration,
      currentSongProgress: progress,
      songStreamLoading: false
    });
  }

  songFinishedPlayingCallback() {
    // last.fm scrobbling
    var info = songInfo.getArtistAndTrack(
      this.state.songQueue[this.state.currentSongNumber].data.title
    );
    lastfm.scrobble(
      settingsApi.loadFromSettings('lastfmSession'),
      info.artist,
      info.track
    );

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
    this.changeSong(Math.min(
      this.state.currentSongNumber+1,
      this.state.songQueue.length-1
    ));
  }

  prevSong() {
    this.changeSong(Math.max(this.state.currentSongNumber-1,0));
  }

  changeSong(num) {
    // We need to update state in two steps - first we update the current song
    // number, then we update the url to reflect the new number.
    this.setState((prevState, props) => ({
      currentSongNumber: num
    }));

    this.setState((prevState, props) => ({
      currentSongUrl: prevState.songQueue[prevState.currentSongNumber].data.streamUrl
    }));
  }

  videoInfoCallback(song, err, info) {
    var formatInfo = info.formats.filter(function(e){return e.itag=='140'})[0];
    song.data.streamUrl = formatInfo.url;
    song.data.streamUrlLoading = false;
    song.data.streamLength = formatInfo.clen;
    this.setState({songQueue: this.state.songQueue});
  }

  videoInfoThenPlayCallback(song, err, info) {
    this.videoInfoCallback(song, err, info);
    this.togglePlay();
  }

  downloadVideoInfoCallback(song, err, info) {
    var formatInfo = info.formats.filter(function(e){return e.itag=='140'})[0];
    song.length = formatInfo.clen;
    this.setState({});
  }

  addFromPlaylistCallback(songs) {
    songs.map((el, i) => {
      youtube.youtubeFetchVideoDetails(el);
      this.addToQueue(el, this.videoInfoCallback, null)
    });

    this.togglePlay();
  }

  addToQueue(song, callback, event) {
    if (song.source === 'youtube'){
      if (typeof(callback)==='undefined') callback=this.videoInfoCallback;

      song.data.streamUrlLoading = true;
      ytdl.getInfo(
        `http://www.youtube.com/watch?v=${song.data.id}`,
         callback.bind(this, song)
      );

      this.state.songQueue.push(song);
    } else if (song.source === 'soundcloud') {
      this.state.songQueue.push(song);
    } else if (song.source === 'bandcamp track') {

      song.data.streamUrlLoading = true;
      bandcamp.getTrackStream(song.data.id, (result) => {
        song.data.streamUrl = result;
        song.data.streamUrlLoading = false;
        this.setState({songQueue: this.state.songQueue});
      });

      this.state.songQueue.push(song);
    } else if(song.source === 'bandcamp album') {
      bandcamp.getAlbumTracks(song, (result) => {
        result.map((el, i) => {
          this.addToQueue(el, callback, event);
        });
      });

    }


    this.setState({songQueue: this.state.songQueue});
  }

  playNow(song, callback, event) {
    if (song.source==='youtube playlists') {
      this.clearQueue();

      var songs = youtube.youtubeGetSongsFromPlaylist(song.data.id,
        this.addFromPlaylistCallback.bind(this));

      return;
    }

    this.clearQueue();
    this.state.songQueue.length = 0;
    this.addToQueue(song, callback, event);

    if (song.source === 'soundcloud' || song.source === 'bandcamp track') {
      this.togglePlay();
    }
  }

  clearQueue() {
    this.setState({
      playStatus: Sound.status.STOPPED,
      songQueue: [],
      currentSongNumber: 0,
      currentSongPosition: 0,
      seekFromPosition: 0,
      songStreamLoading: false
    });
  }

  togglePlaylists() {
    this.setState({mainContents: enums.MainContentItemEnum.PLAYLISTS});
  }

  toggleSettings() {
    this.setState({mainContents: enums.MainContentItemEnum.SETTINGS});
  }

  toggleSearch() {
    this.setState({mainContents: enums.MainContentItemEnum.SEARCH});
  }

  toggleQueue() {
    this.setState({sidebarContents: enums.SidebarMenuItemEnum.QUEUE});
  }

  toggleDownloads() {
    this.setState({sidebarContents: enums.SidebarMenuItemEnum.DOWNLOADS});
  }

  sidebarGoBackCallback() {
    this.setState({sidebarContents: enums.SidebarMenuItemEnum.DEFAULT});
  }

  startDownload() {
    this.state.downloadQueue.map((song)=>{
      if (song.status === enums.DownloadQueueStatusEnum.QUEUED){
        song.status = enums.DownloadQueueStatusEnum.INPROGRESS;

        ytdl(`http://www.youtube.com/watch?v=${song.data.id}`, {quality: '140'})
        .on('data', (chunk)=>{
          song.progress += chunk.length;
          song.progressUpdates++;
          if (song.progressUpdates%10 === 0) {
            this.setState({downloadQueue: this.state.downloadQueue});
          }
        })
        .pipe(fs.createWriteStream(
          path.join(
            globals.directories.userdata,
            globals.directories.downloads,
            song.data.title+'.m4a'
          )
        ))
        .on('finish', ()=>{
          song.status = enums.DownloadQueueStatusEnum.FINISHED;
          this.setState({downloadQueue: this.state.downloadQueue});
        })
        .on('error', (error)=>{
          song.status = enums.DownloadQueueStatusEnum.ERROR;
          this.setState({downloadQueue: this.state.downloadQueue});
        });
      }
    });

    this.setState({downloadQueue: this.state.downloadQueue});
  }

  addToDownloads(song, object, event) {
    var newDownloadItem = {
      source: song.source,
      status: enums.DownloadQueueStatusEnum.QUEUED,
      length: song.data.streamLength,
      progress: 0,
      progressUpdates: 0,
      data: {
        id: song.data.id,
        title: song.data.title
      }
    };

    ytdl.getInfo(
      `http://www.youtube.com/watch?v=${song.data.id}`,
      this.downloadVideoInfoCallback.bind(this, newDownloadItem)
    );

    this.state.downloadQueue.push(newDownloadItem);
    this.setState(this.state);

    this.showAlertSuccess('Song "'+song.data.title+'" added to downloads.');
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

      // last.fm scrobbling
      var info = songInfo.getArtistAndTrack(
        this.state.songQueue[this.state.currentSongNumber].data.title
      );
      lastfm.updateNowPlaying(
        settingsApi.loadFromSettings('lastfmSession'),
        info.artist,
        info.track
      );
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
      case enums.SidebarMenuItemEnum.DEFAULT:
        break;
      case enums.SidebarMenuItemEnum.QUEUE:
        sidebarContentsRendered = (
          <QueueBar
          queue={this.state.songQueue}
          currentSong={this.state.currentSongNumber}
          clearQueue={this.clearQueue.bind(this)}
          changeSong={this.changeSong.bind(this)}
          home={this}
          />
        );
        break;

      case enums.SidebarMenuItemEnum.DOWNLOADS:
        sidebarContentsRendered = (
          <DownloadQueue
            downloads={this.state.downloadQueue}
            startDownload={this.startDownload.bind(this)}
          />
        );
        break;
    }

    return (
      <div>
        <SidebarMenu
          playStatus={this.state.playStatus}
          togglePlayCallback={this.togglePlay.bind(this)}
          nextSongCallback={this.nextSong.bind(this)}
          prevSongCallback={this.prevSong.bind(this)}
          seekFromCallback={this.seekFrom.bind(this)}
          songStreamLoading={this.state.songStreamLoading}
          toggleQueue={this.toggleQueue.bind(this)}
          toggleDownloads={this.toggleDownloads.bind(this)}
          togglePlaylists={this.togglePlaylists.bind(this)}
          toggleSearch={this.toggleSearch.bind(this)}
          toggleSettings={this.toggleSettings.bind(this)}
          goBackCallback={this.sidebarGoBackCallback.bind(this)}
          songQueue={this.state.songQueue}
          currentSongNumber={this.state.currentSongNumber}
          currentSongProgress={this.state.currentSongProgress}
          menu={sidebarContentsRendered}
        />

        <div className={styles.container}>
           <MainContent
             contents={this.state.mainContents}
             addToQueue={this.addToQueue}
             addToDownloads={this.addToDownloads.bind(this)}
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
