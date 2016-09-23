import React from 'react';

import YoutubeSongList from './youtube-songlist.component.js';
import SearchField from './searchfield.component.js';

class SongList extends React.Component {
  constructor(props){
    super(props);
  }

  youtubeSongList(){
    return(
        <YoutubeSongList appContainer={this.props.appContainer} songs={this.props.songList} addToQueue={this.props.addToQueue}/>
    );
  }

  render () {
    if (!this.props.loading){
      return(
          <div className="col-md-6">
          <SearchField handleSearch={this.props.handleSearch} />
          {this.youtubeSongList()}
        </div>
      );
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
