import core from 'nuclear-core';
import ytdl from 'ytdl-core';

import globals from '../globals';
import ytlist from 'youtube-playlist';
import getArtistTitle from 'get-artist-title';

import { trackSearch } from './youtube-search';

const lastfm = new core.LastFmApi(
  globals.lastfmApiKey,
  globals.lastfmApiSecret
);

export { trackSearch };

function isValidURL (str) {
  let pattern = new RegExp('^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
    '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

function analyseUrlType (url) {
  let analysisResult = {
    url,
    isValid: false,
    isYoutube: false,
    isYoutubePlaylist: false,
    isYoutubeVideo: false
  };
  analysisResult.isValid = isValidURL(url);
  let isYoutubeRegex = /https:\/\/www.youtube.com\/*./g;
  let isYoutubePlaylistRegex = /[?&]list=([a-zA-Z0-9-_]*)/g;
  let isYoutubeVideoRegex = /[?&]v=([a-zA-Z0-9-_]{11})[^0-9a-zA-Z_-]{0,1}/g;
  analysisResult.isYoutube = url.match(isYoutubeRegex);
  analysisResult.isYoutubePlaylist = analysisResult.isValid && analysisResult.isYoutube && url.match(isYoutubePlaylistRegex);
  analysisResult.isYoutubeVideo = analysisResult.isValid && analysisResult.isYoutube && url.match(isYoutubeVideoRegex);
  return analysisResult;
}

function getTrackFromTitle (title) {
  let result = getArtistTitle(title);
  if (result) {
    return lastfm.searchTracks(result[0] + ' ' + result[1], 1)
      .then(tracks => tracks.json())
      .then(tracksJson => {
        return new Promise((resolve) => {
          resolve(tracksJson.results.trackmatches.track[0]);
        });
      });
  } else {
    return new Promise((resolve) => {
      resolve({});
    });
  }
}

function handleYoutubePlaylist (url) {
  return ytlist(url, 'name')
    .then(res => {
      let allTracks = res.data.playlist.map((elt) => {
        return getTrackFromTitle(elt);
      });
      return Promise.all(allTracks);
    })
    .catch(function () {
      return new Promise((resolve) => {
        resolve([]);
      });
    });
}

function handleYoutubeVideo (url) {
  return ytdl.getInfo(url)
    .then(info => {
      return getTrackFromTitle(info.title)
        .then(track => {
          return [track];
        });
    })
    .catch(function () {
      // console.log('error', err);
      return Promise.resolve([]);
    });
}

export function urlSearch (url) {
  let urlAnalysis = analyseUrlType(url);
  // console.log(urlAnalysis);
  if (urlAnalysis.isYoutubePlaylist) {
    return handleYoutubePlaylist(url);
  } else if (urlAnalysis.isYoutubeVideo) {
    return handleYoutubeVideo(url);
  } else {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}
