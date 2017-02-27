import Axios from 'axios';

const globals = require('./Globals');
const vimeo = require('vimeo');
const lib = new vimeo.Vimeo(globals.vimeoClientId, globals.vimeoClientSecret, globals.vimeoAccessToken);

const ytdl = require('ytdl-core');

function vimeoSearch(searchTerms, searchResults, songListChangeCallback) {
  lib.request({
    path: '/videos',
    query: {
      page: 1,
      per_page: 50,
      query: searchTerms,
      sort: 'relevant',
      direction: 'desc'
    }
  },
   (error, body, status, headers) => {
     body.data.map((el, i) => {
       var newItem = {
         source: 'vimeo',
         data: {
           id: el.uri,
           thumbnail: el.pictures.sizes[el.pictures.sizes.length-1].link,
           title: el.name,
           length:
            Math.floor(el.duration/60) +
            ':' +
            Math.floor(el.duration - Math.floor(el.duration/60)*60),
           streamUrl: null,
           streamUrlLoading: false,
           streamLength: 0
         }
       };
       searchResults.push(newItem);
     });

     songListChangeCallback.bind(this)(searchResults);
     this.setState({songList: searchResults});

  });
}

function vimeoFetchStream(video, callback) {
  var configUrl = 'https://player.vimeo.com' + video.data.id.replace('videos', 'video') + '/config';
  Axios.get(configUrl)
  .then((response) => {
    video.data.streamUrl = response.data.request.files.progressive[0].url;
    callback(video);
  });
}

module.exports = {
  vimeoSearch: vimeoSearch,
  vimeoFetchStream: vimeoFetchStream
}
