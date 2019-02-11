const apiUrl = 'http://ws.audioscrobbler.com/2.0/?method=';

import globals from '../globals';

let lastfmApiKey = globals.lastfmApiKey;

function makeLastfmRequest (parameters) {
  return fetch(
    apiUrl + parameters + '&api_key=' + lastfmApiKey + '&format=json'
  );
}

function searchTracks (terms, limit = 30) {
  let parameters = 'track.search&track=' + encodeURIComponent(terms);

  parameters += '&limit=' + limit;
  return makeLastfmRequest(parameters);
}

function getTopTracks () {
  let parameters = 'chart.gettoptracks';
  return makeLastfmRequest(parameters);
}

function getSimilarTracks (artist, track, limit = 100) {
  let parameters = 'track.getsimilar';
  parameters += '&artist=' + encodeURIComponent(artist);
  parameters += '&track=' + encodeURIComponent(track);
  parameters += '&limit=' + limit;
  return makeLastfmRequest(parameters);
}

module.exports = {
  searchTracks,
  getTopTracks,
  getSimilarTracks
};
