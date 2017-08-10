import globals from '../globals';
const _ = require('lodash');

const apiUrl = 'http://www.last.fm/api/';
const scrobblingApiUrl = 'http://ws.audioscrobbler.com/2.0/';

function sign(url) {
  let tokens = decodeURIComponent((url.split('?')[1].split('&').sort().join()).replace(/,/g, '').replace(/=/g,''));

  return require('md5')(tokens+globals.lastfmApiSecret);
}

function prepareUrl(url) {
  var withApiKey = `${url}&api_key=${globals.lastfmApiKey}`;
  return `${withApiKey}&api_sig=${sign(withApiKey)}` ;
}

function addApiKey(url) {
  return `${url}&api_key=${globals.lastfmApiKey}`;
}

function lastFmLoginConnect() {
  return fetch(prepareUrl(scrobblingApiUrl + '?method=auth.getToken&format=json'));
}

function lastFmLogin(authToken) {
  return fetch(prepareUrl(scrobblingApiUrl + '?method=auth.getSession&token=' + authToken)+'&format=json');
}

function scrobble(artist, track, session) {
  return fetch(prepareUrl(
    scrobblingApiUrl +
    '?method=track.scrobble&sk=' +
    session +
    '&artist=' +
    encodeURIComponent(artist) +
    '&track=' +
    encodeURIComponent(track) +
    '&timestamp=' +
    (Math.floor(new Date()/1000 - 540))),
    {
      method: 'POST'
    }
  );
}

function updateNowPlaying(artist, track, session) {
  return fetch(prepareUrl(
    scrobblingApiUrl +
    '?method=track.updateNowPlaying&sk=' +
    session +
    '&artist=' +
    encodeURIComponent(artist) +
    '&track=' +
    encodeURIComponent(track)),
    {
      method: 'POST'
    }
  );
}

module.exports = {
  lastFmLoginConnect,
  lastFmLogin,
  scrobble,
  updateNowPlaying
};
