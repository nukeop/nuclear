import globals from '../globals';

const apiUrl = 'http://www.last.fm/api/';
const scrobblingApiUrl = 'http://ws.audioscrobbler.com/2.0/';

function sign(url) {
  var tokens = decodeURIComponent((url.split('?')[1].split('&').sort().join()).replace(/,/g, '').replace(/=/g,''));

  return require('md5')(tokens+globals.lastfmApiSecret);
}

function prepareUrl(url) {
  var withApiKey = `${url}&api_key=${globals.lastfmApiKey}`;
  return `${withApiKey}&api_sig=${sign(withApiKey)}` ;
}

function addApiKey(url) {
  return `${url}&api_key=${globals.lastfmApiKey}`;
}

function lastfmLoginConnect() {
  return fetch(prepareUrl(scrobblingApiUrl + '?method=auth.getToken&format=json'));
}

module.exports = {
  lastfmLoginConnect
};
