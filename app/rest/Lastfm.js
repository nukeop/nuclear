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

export function lastFmLoginConnect() {
  return fetch(prepareUrl(scrobblingApiUrl + '?method=auth.getToken&format=json'));
}

export function lastFmLogin(authToken) {
  return fetch(prepareUrl(scrobblingApiUrl + '?method=auth.getSession&token=' + authToken)+'&format=json');
}

export function scrobble(artist, track, session) {
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

export function updateNowPlaying(artist, track, session) {
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

export function getArtistInfo(artist) {
  return fetch(addApiKey(
    scrobblingApiUrl +
    '?method=artist.getinfo&artist=' +
    encodeURIComponent(artist) +
    '&format=json'
  ));
}

export function getArtistTopTracks(artist) {
  return fetch(addApiKey(
    scrobblingApiUrl +
    '?method=artist.gettoptracks&artist=' +
    encodeURIComponent(artist) +
    '&format=json'
  ));
}

export function getTopTags() {
  return fetch(addApiKey(
    scrobblingApiUrl +
    '?method=tag.getTopTags&format=json'
  ));
}

export function getTagInfo(tag) {
  return fetch(addApiKey(
    scrobblingApiUrl +
      '?method=tag.getInfo&format=json&tag=' +
      tag
  ));
}

export function getTagTracks(tag) {
  return fetch(addApiKey(
    scrobblingApiUrl +
    '?method=tag.getTopTracks&format=json&tag=' +
    tag
  ));
}

export function getTagAlbums(tag) {
  return fetch(addApiKey(
    scrobblingApiUrl +
      '?method=tag.getTopAlbums&format=json&tag=' +
      tag
  ));
}

export function getTagArtists(tag) {
  return fetch(addApiKey(
    scrobblingApiUrl +
      '?method=tag.getTopArtists&format=json&tag=' +
      tag
  ));
}

export function getSimilarTags(tag) {
  return fetch(addApiKey(
    scrobblingApiUrl +
      '?method=tag.getSimilar&format=json&tag=' +
      tag
  ));
}
