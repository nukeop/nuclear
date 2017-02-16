const bandcamp = require('bandcamp-scraper');
const request = require('request');

function getTrackStream(url, callback) {
  var trackRegex = /{"mp3-128":"(.+?)"/ig;

  request(url, (err, response, body) => {
    if(err) {
      console.error('Could not retrieve stream URL for track: ' + url);
    } else {
      var result = trackRegex.exec(body);

      if (result !== null) {
        callback('http:' + result[1]);
      } else {
        console.error('Could not retrieve stream URL for track: ' + url);
      }
    }
  });
}

function bandcampSearch(terms, searchResults, songListChangeCallback) {

  var tempResults = [];
  var added = 0;

  for (var i=1; i<6; i++) {
    bandcamp.search({query: terms, page: i}, (error, results) => {
        tempResults = tempResults.concat(results);
        if(added++ >= 4) {
          tempResults = tempResults.filter((el) => {return (el.type==='track')||(el.type==='album')});
          tempResults.map((el, i) => {
            var newItem = {
              source: el.type==='album' ? 'bandcamp album' : 'bandcamp track',
              data: {
                id: el.url,
                thumbnail: el.imageUrl,
                artist: el.artist,
                title: el.name,
                length: el.numTracks != undefined ? el.numTracks : 'Unknown',
                streamUrl: el.url,
                streamUrlLoading: false,
                streamLength: null
              }
            };

            if (el.type ==='track') {
              getTrackStream(el.url, (result) => {
                newItem.data.streamUrl = result;
              });
            }

            searchResults.push(newItem);
          });

          this.songListChangeCallback(searchResults);
          this.setState({songList: searchResults});
        }
    });
  }
}

module.exports = {
  bandcampSearch: bandcampSearch
}
