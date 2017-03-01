import Axios from 'axios';

const globals = require('./Globals');

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

function lastfmLoginConnect(callback) {
  Axios.get(prepareUrl(scrobblingApiUrl + '?method=auth.getToken&format=json'))
  .then((response) => {
    var authToken = response.data.token;

    require('electron').shell.openExternal(
      'http://www.last.fm/api/auth/?api_key=' + globals.lastfmApiKey + '&token=' + authToken
    );

    callback(authToken);
  });
}

function lastfmLogin(authToken, callback) {
    Axios.get(prepareUrl(scrobblingApiUrl + '?method=auth.getSession&token=' + authToken)+'&format=json')
    .then((response) => {
        callback(response.data.session.key, response.data.session.name);
    });
}

function scrobble(session, artist, track) {
  Axios.post(prepareUrl(
    scrobblingApiUrl +
    '?method=track.scrobble&sk=' +
    session +
    '&artist=' +
    encodeURIComponent(artist) +
    '&track=' +
    encodeURIComponent(track) +
    '&timestamp=' +
    (Math.floor(new Date()/1000))
  ))
  .then((response) => {

  });
}

function updateNowPlaying(session, artist, track) {
  Axios.post(prepareUrl(
    scrobblingApiUrl +
    '?method=track.updateNowPlaying&sk=' +
    session +
    '&artist=' +
    encodeURIComponent(artist) +
    '&track=' +
    encodeURIComponent(track)
  ))
  .then((response) => {

  });
}

function getTrackInfo(artist, track, callback) {
  Axios.get(addApiKey(
    scrobblingApiUrl +
    '?method=track.getInfo&artist=' +
    encodeURIComponent(artist) +
    '&track=' +
    encodeURIComponent(track) +
    '&format=json'
  ))
  .then((response) => {
    callback(response);
  });
}

function artistSearch(artist, callback) {
  Axios.get(addApiKey(
    scrobblingApiUrl +
    '?method=artist.search&artist=' +
    encodeURIComponent(artist) +
    '&format=json'
  ))
  .then((response) => {
    callback(response);
  });
}

function getArtistInfo(artist, callback) {
  Axios.get(addApiKey(
    scrobblingApiUrl +
    '?method=artist.getinfo&artist=' +
    encodeURIComponent(artist) +
    '&format=json'
  ))
  .then((response) => {
    callback(response);
  });
}

function getArtistTopTracks(artist, callback) {
  Axios.get(addApiKey(
    scrobblingApiUrl +
    '?method=artist.gettoptracks&artist=' +
    encodeURIComponent(artist) +
    '&format=json'
  ))
  .then((response) => {
    callback(response);
  });
}

function albumSearch(album, callback) {
  Axios.get(addApiKey(
    scrobblingApiUrl +
    '?method=album.search&album=' +
    encodeURIComponent(album) +
    '&format=json'
  ))
  .then((response) => {
    callback(response);
  });
}

function getAlbumInfo(artist, album, callback) {
  Axios.get(addApiKey(
    scrobblingApiUrl +
    '?method=album.getInfo&artist=' +
    encodeURIComponent(artist) +
    '&album=' +
    encodeURIComponent(album) +
    '&format=json'
  ))
  .then((response) => {
    callback(response);
  });
}

module.exports = {
  lastfmLoginConnect: lastfmLoginConnect,
  lastfmLogin: lastfmLogin,
  scrobble: scrobble,
  updateNowPlaying: updateNowPlaying,
  getAlbumInfo: getAlbumInfo,
  albumSearch: albumSearch,
  artistSearch: artistSearch,
  getArtistInfo: getArtistInfo,
  getArtistTopTracks: getArtistTopTracks,
  getTrackInfo: getTrackInfo
}
