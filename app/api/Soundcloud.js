import Axios from 'axios';

const globals = require('./Globals');

const apiUrl = 'https://api.soundcloud.com';

function prepareUrl(url) {
  return `${url}&client_id=${globals.soundcloudApiKey}`;
}

function soundcloudDurationToStr(duration) {
  var seconds = duration/1000;
  var hours = Math.floor(seconds/3600);
  var minutes = Math.floor((seconds - hours*3600)/60);
  seconds = Math.floor(seconds - (hours*3600 + minutes*60));

  if (hours > 0){
    return hours + ":" + minutes + ":" + seconds;
  }
  else {
    return minutes + ":" + seconds;
  }
}

function soundcloudSearch(terms, searchResults, songListChangeCallback) {
  var _this = this;

  Axios.get(prepareUrl(apiUrl + '/tracks?limit=50&q=' + terms))
  .then((response) => {
    response.data.map((el, i) => {

      var newItem = {
          source: 'soundcloud',
          data: {
            id: el.id,
            thumbnail: el.artwork_url,
            title: el.title,
            length: soundcloudDurationToStr(el.duration),
            streamUrl: prepareUrl(el.stream_url+'?'),
            streamUrlLoading: false,
            streamLength: el.original_content_size
          }
        };

        searchResults.push(newItem);
        songListChangeCallback.bind(_this)(searchResults);
        _this.setState({songList: searchResults});

    });
  });
}

module.exports = {
  soundcloudSearch: soundcloudSearch
}
