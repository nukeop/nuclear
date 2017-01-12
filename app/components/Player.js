import React, { Component } from 'react';
import Sound from 'react-sound';

import styles from './Player.css';

export default class Player extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const playButtonClass = this.props.playStatus===Sound.status.PLAYING ? 'fa fa-pause' : 'fa fa-play';

      return(
        <footer className="footer">
          <a href='#' className={`btn ${styles.play_btn}`} onClick={this.props.togglePlayCallback}><i className={playButtonClass}></i></a>
        </footer>
      );
  }
}
