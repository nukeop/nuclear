import React, { Component } from 'react';
import Sound from 'react-sound';
const { BrowserWindow, globalShortcut } = require('electron').remote;

import styles from './Player.css';

export default class Player extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    // Register media key shortcuts
    if (!globalShortcut.isRegistered('mediaplaypause'))
      globalShortcut.register('mediaplaypause', this.props.togglePlayCallback);

    if (!globalShortcut.isRegistered('medianexttrack'))
      globalShortcut.register('medianexttrack', this.props.nextSongCallback);

    if (!globalShortcut.isRegistered('mediaprevioustrack'))
      globalShortcut.register('mediaprevioustrack', this.props.prevSongCallback);

  }

  onClickSeek(event, value){
    var progressBar = document.getElementById("progress_bar");
    var percent = (event.clientX - progressBar.offsetLeft)/(progressBar.offsetWidth);
    console.log(percent);
    this.props.seekFromCallback(percent);
  }

  render() {
    var playButtonClass = this.props.playStatus===Sound.status.PLAYING ? 'fa fa-pause' : 'fa fa-play';
    if (this.props.songStreamLoading) {
      playButtonClass = `${styles.player_loading} fa fa-spinner fa-pulse fa-fw`;
    }

    var progressBarStyle = {"width": this.props.currentSongProgress+"%"};

      return(
          <div className={styles.player_container}>
            <div id="progress_bar" className={`${styles.player_progress} progress`} onClick={this.onClickSeek.bind(this)}>
              <div className={`${styles.player_progress_fill} progress-bar`} style={progressBarStyle} role="progressbar"/>
            </div>

            <a
              href='#'
              className={`btn ${styles.player_btn}`}
              onClick={this.props.prevSongCallback}>
                <i className={`${styles.player_backward} fa fa-backward`}></i>
            </a>
            <a
              href='#'
              className={`btn ${styles.player_btn} ${styles.player_play_btn}`}
              onClick={this.props.togglePlayCallback}>
                <i className={`${playButtonClass} ${styles.player_play}`}></i>
            </a>
            <a
              href='#'
              className={`btn ${styles.player_btn}`}
              onClick={this.props.nextSongCallback}>
                <i className={`${styles.player_forward} fa fa-forward`}></i>
            </a>
          </div>
      );
  }
}
