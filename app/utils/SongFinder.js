const strSim = require('string-similarity');
const yt = require('../api/Youtube');

const similarityThreshold = 0.85; //When to consider a song to be a match
const ratioTolerance = 0.2;

//These words will automatically give the match a score of 0 if they do not
//occur in the original title
const blacklist = ['cover', 'live'];


function selectBestMatch(matches, callback) {
  if (matches.length < 1) {
    callback('No matches found.', null)
  } else {
    matches.sort((a, b) => {return b.confidence - a.confidence;});
    callback(null, matches[0].track);
  }
}

function getTrack(artist, title, length, callback) {
  // To automatically find the best match, we first compare title similarity,
  // and if it's above a certain threshold, we compare the length. If it's
  // within acceptable range, we add it to potential matches, then we
  // return the best match.

  var fullTitle = artist+ ' - '+ title;
  var matches = [];

  yt.youtubeTrackSearch(fullTitle, (response) => {

    var processed = 0;

    response.data.items.map((el, i) => {

      var similarity = strSim.compareTwoStrings(fullTitle, el.snippet.title);
      if (similarity > similarityThreshold) {
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
          var ytmillis = newItem.data.length.split(':');
          ytmillis = (ytmillis[0]*60 + 1*ytmillis[1]) * 1000;
          var ratio = 1.0;
          if (length !=0) {
            ratio = ytmillis/length;
          }

          if (Math.abs(1.0-ratio) < ratioTolerance) {
            var comparisonItem = {
              confidence: (similarity+(1.0-Math.abs(1.0-ratio)))/2.0,
              track: newItem
            };

            blacklist.forEach((word) => {
              if (el.snippet.title.indexOf(word) != -1) {
                comparisonItem.confidence = 0.0;
              }
            });

            matches.push(comparisonItem);
            processed++;
            if (processed===response.data.items.length) {
              selectBestMatch(matches, callback);
            }
          } else {
            processed++;
            if (processed===response.data.items.length) {
              selectBestMatch(matches, callback);
            }
          }
        });


      } else {
        processed++;
        if (processed===response.data.items.length) {
          selectBestMatch(matches, callback);
        }
      }
    });
  });
}

module.exports = {
  getTrack: getTrack
};
