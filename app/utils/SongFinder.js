const yt = require('../api/Youtube');

function getTrack(artist, title, callback) {
  var fullTitle = artist+ ' - '+ title;

  yt.youtubeTrackSearch(fullTitle, (response) => {
    response.data.items.some((el, i) => {
      if (el.snippet.title === fullTitle) {
        var newItem = {
          source: 'youtube',
          artist: artist,
          title: title,
          data: {
            id: el.id.videoId,
            thumbnail: el.snippet.thumbnails.medium.url,
            title: fullTitle,
            length: "Unknown",
            streamUrl: "",
            streamUrlLoading: false,
            streamLength: 0
          }
        };

        yt.youtubeFetchVideoDetails(newItem, () => {
          callback(newItem);
        });

        return true;
      }
    });
  });
}

module.exports = {
  getTrack: getTrack
};
