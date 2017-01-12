import React, { Component } from 'react';

import SongList from './SongList';

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
      <div>
        <SongList
          songList={this.props.songList}
          addToQueue={this.props.addToQueue}
          playNow={this.props.playNow}
          home={this.props.home}
        />
      </div>
    );
  }
}
