import React, { Component } from 'react';

import SongList from './SongList';
import styles from './MainContent.css';

export default class MainContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    if(this.props.songListLoading) {
      return(
        <div className="content-loading">
          <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
        </div>
      );
    }

    return(
      <div className={styles.main_content_container}>
        <SongList
          songList={this.props.songList}
          addToQueue={this.props.addToQueue}
          addToDownloads={this.props.addToDownloads}
          playNow={this.props.playNow}
          home={this.props.home}
        />
      </div>
    );
  }
}
