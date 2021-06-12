import logger from 'electron-timber';
import _ from 'lodash';
import getArtistTitle from 'get-artist-title';
import ytdl from 'ytdl-core';
import ytlist from 'youtube-playlist';
import ytsr from 'ytsr';

import LastFmApi from './Lastfm';
import { StreamQuery } from '../plugins/plugins.types';
import * as SponsorBlock from './SponsorBlock';

const lastfm = new LastFmApi(
  process.env.LAST_FM_API_KEY,
  process.env.LAST_FM_API_SECRET
);

const baseUrl = 'http://www.youtube.com/watch?v=';

function isValidURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
    '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

function analyseUrlType(url) {
  const analysisResult = {
    url,
    isValid: false,
    isYoutube: false,
    isYoutubePlaylist: false,
    isYoutubeVideo: false
  };
  analysisResult.isValid = isValidURL(url);
  const isYoutubeRegex = /https:\/\/www.youtube.com\/*./g;
  const isYoutubePlaylistRegex = /[?&]list=([a-zA-Z0-9-_]*)/g;
  const isYoutubeVideoRegex = /[?&]v=([a-zA-Z0-9-_]{11})[^0-9a-zA-Z_-]{0,1}/g;
  analysisResult.isYoutube = url.match(isYoutubeRegex);
  analysisResult.isYoutubePlaylist = analysisResult.isValid && analysisResult.isYoutube && url.match(isYoutubePlaylistRegex);
  analysisResult.isYoutubeVideo = analysisResult.isValid && analysisResult.isYoutube && url.match(isYoutubeVideoRegex);
  return analysisResult;
}

function getTrackFromTitle(title): Promise<Record<string, any>> {
  const result = getArtistTitle(title);
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

function handleYoutubePlaylist(url) {
  return ytlist(url, 'name')
    .then(res => {
      const allTracks = res.data.playlist.map((elt) => {
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

function handleYoutubeVideo(url) {
  return ytdl.getInfo(url)
    .then(info => {
      if (info.videoDetails) {
        const videoDetails = info.videoDetails;

        return [{
          streams: [{source: 'youtube', id: videoDetails.videoId}],
          name: videoDetails.title,
          thumbnail: videoDetails.thumbnails[0].url,
          artist: {name: videoDetails.ownerChannelName}
        }];
      } 
      return [];
    })
    .catch(function () {
      return Promise.resolve([]);
    });
}

export function urlSearch(url) {
  const urlAnalysis = analyseUrlType(url);
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

export async function liveStreamSearch(query: string) {
  if (isValidURL(query)) {
    return [];
  }

  const videoFilter = (await ytsr.getFilters(query)).get('Type').get('Video');
  const liveFilter = (await ytsr.getFilters(videoFilter.url)).get('Features').get('Live');
  const options = {
    limit: 10
  };
  const searchResults = await ytsr(liveFilter.url, options);

  return searchResults.items.map((video: ytsr.Video) => {
    return {
      streams: [{source: 'youtube', id: video.id}],
      name: video.title,
      thumbnail: video.bestThumbnail.url,
      artist: {name: video.author.name}
    };
  });
}

export async function trackSearch(query: StreamQuery, omitStreamId?: string, sourceName?: string) {
  const terms = query.artist + ' ' + query.track;
  return trackSearchByString(terms, omitStreamId, sourceName);
}

export async function trackSearchByString(query: string, omitStreamId?: string, sourceName?: string) {
  const filterOptions = await ytsr.getFilters(query);
  const filterVideoOnly = filterOptions.get('Type').get('Video'); 
  const results = await ytsr(filterVideoOnly.url, { limit: omitStreamId ? 15 : 1 });
  const topTrack: ytsr.Video = _.find(
    results.items as ytsr.Video[],
    item => (!omitStreamId || item.id !== omitStreamId)
  ) as ytsr.Video;

  try {
    const topTrackInfo = await ytdl.getInfo(topTrack.url);
    const formatInfo = ytdl.chooseFormat(topTrackInfo.formats, { quality: 'highestaudio' });
    const segments = await SponsorBlock.getSegments(topTrack.id);
  
    return {
      source: sourceName,
      id: topTrack.id,
      stream: formatInfo.url,
      duration: parseInt(topTrackInfo.videoDetails.lengthSeconds),
      title: topTrackInfo.videoDetails.title,
      thumbnail: topTrack.bestThumbnail.url,
      format: formatInfo.container,
      skipSegments: segments
    };
  } catch (e){
    logger.error('youtube track search error');
    logger.error(e);
    throw new Error('Warning: topTrack.url is undefined, removing song');    
  }
}

export const getStreamForId = async (id: string) => {
  const videoUrl = baseUrl + id;
  const trackInfo = await ytdl.getInfo(videoUrl);
  const formatInfo = ytdl.chooseFormat(trackInfo.formats, { quality: 'highestaudio' });
  return formatInfo.url;
};
