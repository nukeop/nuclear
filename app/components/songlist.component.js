import React from 'react';

import YoutubeSongList from './youtube-songlist.component.js';

class SongList extends React.Component {
  constructor(props){
    super(props);
  }

  youtubeSongList(){
    return(
        <div className="col-md-6">
        <YoutubeSongList appContainer={this.props.appContainer} songs={this.props.songList} addToQueue={this.props.addToQueue}/>
        </div>
    );
  }

  render () {
    if (!this.props.loading){
      return this.youtubeSongList();
    }else{
      var divStyle={
        "textAlign": "center",
        "verticalAlign": "middle"
      };
      var loadingStyle={
        color: "#fff",
        "lineHeight": "85vh"
      };
      return (
          <div className="col-md-6" style={divStyle}>
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={loadingStyle}></i>
          </div>
      );
    }
  }
}

export default SongList;
