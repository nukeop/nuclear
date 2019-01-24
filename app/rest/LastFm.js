const apiUrl = 'http://ws.audioscrobbler.com/2.0/?method=';

import globals from '../globals';

let lastfmApiKey = globals.lastfmApiKey;
let lastfmApiSecret = globals.lastfmApiSecret;

function makeLastfmRequest (parameters) {
  return fetch(
    apiUrl + parameters + '&api_key=' + lastfmApiKey + '&format=json'
  );
}

function searchTracks (terms, limit = 30) {
  let parameters = 'track.search&track=' + encodeURI(terms);
  parameters += '&limit=' + limit
  return makeLastfmRequest(parameters);
}

function getTopTracks () {
  let parameters = 'chart.gettoptracks';
  return makeLastfmRequest(parameters);
}

module.exports = {
  searchTracks,
  getTopTracks
};
