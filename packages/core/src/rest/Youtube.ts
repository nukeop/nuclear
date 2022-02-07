import logger from 'electron-timber';
import { head } from 'lodash';
import getArtistTitle from 'get-artist-title';
import ytdl from 'ytdl-core';
import ytlist from 'youtube-playlist';
import ytsr from 'ytsr';

import LastFmApi from './Lastfm';
import { StreamData, StreamQuery } from '../plugins/plugins.types';
import * as SponsorBlock from './SponsorBlock';
import { YoutubeHeuristics } from './heuristics';

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
          streams: [{source: 'Youtube', id: videoDetails.videoId}],
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
      streams: [{source: 'Youtube', id: video.id}],
      name: video.title,
      thumbnail: video.bestThumbnail.url,
      artist: {name: video.author.name}
    };
  });
}

export async function trackSearch(query: StreamQuery, omitStreamId?: string, sourceName?: string) {
  return trackSearchByString(query, omitStreamId, sourceName);
}

export async function trackSearchByString(query: StreamQuery, omitStreamId?: string, sourceName?: string, useSponsorBlock = true): Promise<StreamData> {
  const terms = query.artist + ' ' + query.track;
  const filterOptions = await ytsr.getFilters(terms);
  const filterVideoOnly = filterOptions.get('Type').get('Video'); 
  const results = await ytsr(filterVideoOnly.url, { limit: 15 });
  const heuristics = new YoutubeHeuristics();

  const itemsWithoutSkippedIds = (results.items as ytsr.Video[]).filter((item) => {
    return omitStreamId !== item.id;
  });

  const orderedTracks = heuristics.orderTracks({
    tracks: itemsWithoutSkippedIds as ytsr.Video[],
    artist: query.artist,
    title: query.track
  });

  const topTrack: ytsr.Video = head(orderedTracks) as ytsr.Video;

  try {
    const topTrackInfo = await ytdl.getInfo(topTrack.url);
    const formatInfo = ytdl.chooseFormat(topTrackInfo.formats, { quality: 'highestaudio' });
    const segments = useSponsorBlock ? await SponsorBlock.getSegments(topTrack.id) : [];
  
    return {
      source: sourceName,
      id: topTrack.id,
      stream: formatInfo.url,
      duration: parseInt(topTrackInfo.videoDetails.lengthSeconds),
      title: topTrackInfo.videoDetails.title,
      thumbnail: topTrack.bestThumbnail.url,
      format: formatInfo.container,
      skipSegments: segments,
      originalUrl: topTrack.url
    };
  } catch (e){
    logger.error('youtube track search error');
    logger.error(e);
    throw new Error('Warning: topTrack.url is undefined, removing song');    
  }
}

export const getStreamForId = async (id: string, sourceName: string): Promise<StreamData> => {
  try {
    const videoUrl = baseUrl + id;
    const trackInfo = await ytdl.getInfo(videoUrl);
    const formatInfo = ytdl.chooseFormat(trackInfo.formats, { quality: 'highestaudio' });
    const segments = await SponsorBlock.getSegments(id);
  
    return {
      id,
      source: sourceName,
      stream: formatInfo.url,
      duration: parseInt(trackInfo.videoDetails.lengthSeconds),
      title: trackInfo.videoDetails.title,
      thumbnail: trackInfo.thumbnail_url,
      format: formatInfo.container,
      skipSegments: segments,
      originalUrl: videoUrl
    };
  } catch (e) {
    logger.error('youtube track get by id');
    logger.error(e);
    throw new Error(`Can not find youtube track with ${id}`);
  }
};
