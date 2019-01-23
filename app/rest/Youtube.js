import globals from '../globals';
import { lastFmTrackSearchStart } from '../actions';
const ytlist = require('youtube-playlist');
const getArtistTitle = require('get-artist-title')
const lastfm = require('./LastFm')

function prepareUrl (url) {
  return `${url}&key=${globals.ytApiKey}`;
}

export function trackSearch (track) {
  return fetch(prepareUrl('https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q=' + encodeURIComponent(track)));
}

export function playlistSearch (url) {
  if (isValidURL(url)) {
    console.log("Searching playlist : " + url)
    return ytlist(url, 'name')
      .then(res => {
        let allTracks = res.data.playlist.map((elt, i) => {
          let result = getArtistTitle(elt)
          if (result !== undefined) {
            return lastfm.searchTracks(result[0] + ' ' + result[1], 1)
              .then(tracks => tracks.json())
              .then(tracksJson => {
                return new Promise((resolve, reject) => {
                  resolve(tracksJson.results.trackmatches.track[0])
                })
              })
          } else {
            return new Promise((resolve, reject) => { resolve({}) })
          }
        })
        return Promise.all(allTracks)
      })
      .catch(function (err) {
        return new Promise((resolve, reject) => { resolve([]) })
      });
  } else {
    return new Promise((resolve, reject) => { resolve([]) })
  }
}

function isValidURL (str) {
  var pattern = new RegExp('^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
    '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}