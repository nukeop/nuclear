import React, { Component } from 'react';
import Sound from 'react-sound';

import styles from './Player.css';

export default class Player extends Component {
  constructor(props){
    super(props);
  }

  render() {
    var playButtonClass = this.props.playStatus===Sound.status.PLAYING ? 'fa fa-pause' : 'fa fa-play';
    if (this.props.songStreamLoading) {
      playButtonClass = 'fa fa-spinner fa-spin fa-fw';
    }

      return(
        <footer className="footer">
          <a href='#' className={`btn ${styles.player_btn} ${styles.back_btn}`} ><i className="fa fa-backward"></i></a>
          <a href='#' className={`btn ${styles.player_btn}`} onClick={this.props.togglePlayCallback}><i className={playButtonClass}></i></a>
          <a href='#' className={`btn ${styles.player_btn}`} ><i className="fa fa-forward"></i></a>


        </footer>
      );
  }
}
