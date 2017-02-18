import Axios from 'axios';

const globals = require('./Globals');

function ytDurationToStr(ytDuration) {
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

function prepareUrl(url) {
  return `${url}&key=${globals.ytApiKey}`;
}

function youtubeVideoSearch(terms, searchResults, songListChangeCallback) {
  var _this = this;

  Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q="+terms))
  .then(function(response) {
    response.data.items.map(function(el){

      var newYoutubeItem = {
        source: 'youtube',
        data: {
          id: el.id.videoId,
          thumbnail: el.snippet.thumbnails.medium.url,
          title: el.snippet.title,
          length: "Unknown",
          streamUrl: "",
          streamUrlLoading: false,
          streamLength: 0
        }
      };

      Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails&id="+newYoutubeItem.data.id))
      .then(function(response){
        newYoutubeItem.data.length = ytDurationToStr(response.data.items[0].contentDetails.duration);
        searchResults.push(newYoutubeItem);

        songListChangeCallback.bind(_this)(searchResults);
        _this.setState({songList: searchResults});
      });

    });
  });
}

function youtubeRelatedSearch(videoId, searchResults, songListChangeCallback) {
  var _this = this;

  Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&relatedToVideoId="+videoId))
  .then((response)=> {
    response.data.items.map((el)=>{

      var newYoutubeItem = {
        source: 'youtube',
        data: {
          id: el.id.videoId,
          thumbnail: el.snippet.thumbnails.medium.url,
          title: el.snippet.title,
          length: "Unknown",
          streamUrl: "",
          streamUrlLoading: false,
          streamLength: 0
        }
      };

      Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails&id="+newYoutubeItem.data.id))
      .then(function(response){
        newYoutubeItem.data.length = ytDurationToStr(response.data.items[0].contentDetails.duration);
        searchResults.push(newYoutubeItem);

        songListChangeCallback.bind(_this)(searchResults);
        _this.setState({songList: searchResults});
      });

    });
  });
}

function youtubePlaylistSearch(terms, searchResults, songListChangeCallback) {
  var _this = this;

  Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=playlist&maxResults=50&q="+terms))
  .then(function(response) {
    response.data.items.map(function(el){
      var newYoutubePlaylistItem = {
        source: 'youtube playlists',
        data: {
          id: el.id.playlistId,
          thumbnail: el.snippet.thumbnails.medium.url,
          title: el.snippet.title,
          length: "N/A",
        }
      };

      Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/playlists?part=id,contentDetails,snippet&id="+el.id.playlistId))
      .then((response) => {
        newYoutubePlaylistItem.data.length = response.data.items[0].contentDetails.itemCount;

        searchResults.push(newYoutubePlaylistItem);

        songListChangeCallback.bind(_this)(searchResults);
        _this.setState({songList: searchResults});
      });


    });


  });
}

function youtubeFetchVideoDetails(video) {
  // Takes an incomplete record containing at least a video id, and fills it with
  // missing data

  Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id="+video.data.id))
  .then((response) => {
    video.data.thumbnail = response.data.items[0].snippet.thumbnails.medium.url;
    video.data.length = ytDurationToStr(response.data.items[0].contentDetails.duration);
  });
}

function youtubeGetSongsFromPlaylist(playlistId, callback) {
  var playlistItems = []

  Axios.get(prepareUrl("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId="+playlistId))
  .then((response) => {
    response.data.items.map((el, i) => {

      if (el.snippet.description==='This video is unavailable.' ||
          el.snippet.description==='This video is private.') {
        return;
      }

      playlistItems.push({
        source: 'youtube',
        data: {
          id: el.snippet.resourceId.videoId,
          thumbnail: el.snippet.thumbnails.medium.url,
          title: el.snippet.title,
          length: "Unknown",
          streamUrl: "",
          streamUrlLoading: false,
          streamLength: 0
        }
      });
    });

    callback(playlistItems);
  });


}

module.exports = {
  prepareUrl: prepareUrl,
  youtubeVideoSearch: youtubeVideoSearch,
  youtubePlaylistSearch: youtubePlaylistSearch,
  youtubeRelatedSearch: youtubeRelatedSearch,
  youtubeFetchVideoDetails: youtubeFetchVideoDetails,
  youtubeGetSongsFromPlaylist: youtubeGetSongsFromPlaylist,
  ytDurationToStr: ytDurationToStr,
  prepareUrl: prepareUrl
}
