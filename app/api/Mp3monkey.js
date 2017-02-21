var mp3monkey = require('mp3monkey');

function mp3monkeySearch(terms, searchResults, songListChangeCallback) {
  mp3monkey(terms, (err, results) => {
    results.map((el, i) => {
      console.log(el);
      var newItem = {
        source: 'mp3monkey',
        data: {
          artist: el.artist,
          title: el.title,
          streamUrl: el.song,
          streamUrlLoading: false
        }
      };

      searchResults.push(newItem);
    });

    this.songListChangeCallback(searchResults);
    this.setState({songList: searchResults});
  });
}

module.exports = {
  mp3monkeySearch: mp3monkeySearch
}
