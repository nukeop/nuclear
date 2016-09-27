import React from 'react';
import Axios from 'axios';

import SongList from '../components/songlist.component';

class SongListContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ytApiKey: "AIzaSyCIM4EzNqi1in22f4Z3Ru3iYvLaY8tc3bo",
      songs: [],
      loading: false,
      searchTerms: ""
    };
  }

  prepareUrl(url) {
    return `${url}&key=${this.state.ytApiKey}`;
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

  handleSearch(event, value) {
    if(event.key=='Enter'){
      var _this=this;
      var sl = [];
      this.state.searchTerms = document.getElementById("searchField").value;

      _this.props.songSearchStartCallback();

      Axios.get(this.prepareUrl("https://www.googleapis.com/youtube/v3/search?part=id,snippet&maxResults=50&q="+this.state.searchTerms))
        .then(function(response){
          response.data.items.map(function(el){
            if (el.id.kind == "youtube#video"){

              var newItem = {
                id: el.id.videoId,
                thumbnail: el.snippet.thumbnails.medium.url,
                title: el.snippet.title,
                length: "Unknown",
                streamurl: ""
              };

              Axios.get(_this.prepareUrl("https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails&id="+newItem.id))
                .then(function(response){
                  newItem.length = _this.ytDurationToStr(response.data.items[0].contentDetails.duration);
                  sl.push(newItem);

                  _this.setState({songs: sl});

                  _this.props.songListChangeCallback(_this.state.songs);
                });
            }
          });
        });
    }
  }

  render() {
    return (
        <SongList
      appContainer={this.props.appContainer}
      addToQueue={this.props.addToQueue}
      songList={this.props.songList}
      loading={this.props.songListLoading}
      handleSearch={this.handleSearch.bind(this)}
      searchTerms={this.state.searchTerms}
        />
    );
  }
}

export default SongListContainer;
