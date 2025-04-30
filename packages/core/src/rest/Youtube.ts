import { logger } from '../../';
import ytdl from '@nuclearplayer/ytdl-core';
import ytpl from '@distube/ytpl';

import { StreamData, StreamQuery } from '../plugins/plugins.types';
import * as SponsorBlock from './SponsorBlock';
import { YoutubeHeuristics } from './heuristics';
import ytsr, { Video } from '@distube/ytsr';

export type YoutubeResult = {
  streams: { source: string, id: string }[]
  name: string
  thumbnail: string
  artist: string | { name: string }
}

const baseUrl = 'http://www.youtube.com/watch?v=';
const agent = ytdl.createAgent();

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

function formatPlaylistTrack(track: ytpl.result['items'][0]): YoutubeResult {
  return {
    streams: [{ source: 'Youtube', id: track.id }],
    name: track.title,
    thumbnail: track.thumbnail,
    artist: track.author.name
  };
}

export async function handleYoutubePlaylist(url: string): Promise<YoutubeResult[]> {
  try {
    const playlistID = await ytpl.getPlaylistID(url);
    if (ytpl.validateID(playlistID)) {
      const playlistResult = await ytpl(playlistID);
      const allTracks = playlistResult.items;

      return allTracks.map(formatPlaylistTrack);
    }
    return [];

  } catch (e) {
    logger.error('youtube fetch playlist error');
    logger.error(e);
    return [];
  }

}

async function handleYoutubeVideo(url: string): Promise<YoutubeResult[]> {
  try {
    const info = await ytdl.getInfo(url, { agent });
    if (info.videoDetails) {
      const videoDetails = info.videoDetails;
    
      return [{
        streams: [{ source: 'Youtube', id: videoDetails.videoId }],
        name: videoDetails.title,
        thumbnail: getLargestThumbnail(videoDetails.thumbnails),
        artist: { name: videoDetails.ownerChannelName }
      }];
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function urlSearch(url: string): Promise<YoutubeResult[]> {
  const urlAnalysis = analyseUrlType(url);
  if (urlAnalysis.isYoutubePlaylist) {
    return await handleYoutubePlaylist(url);
  } else if (urlAnalysis.isYoutubeVideo) {
    return await handleYoutubeVideo(url);
  } else {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}

export async function liveStreamSearch(query: string): Promise<YoutubeResult[]> {
  if (isValidURL(query)) {
    return [];
  }

  const searchResults = await ytsr(query, { safeSearch: false, limit: 10 });

  return searchResults.items
    .filter(item => item.isLive)
    .map((video: ytsr.Video) => ({
      streams: [{ source: 'Youtube', id: video.id }],
      name: video.name,
      thumbnail: video.thumbnail,
      artist: { name: video.author.name }
    }));
}

export async function trackSearch(query: StreamQuery, sourceName?: string) {
  return trackSearchByString(query, sourceName);
}

export async function trackSearchByString(query: StreamQuery, sourceName?: string, useSponsorBlock = true): Promise<StreamData[]> {
  const terms = query.artist + ' ' + query.track;

  const tracks = (await ytsr(terms, { safeSearch: false, type: 'video', limit: 10 })).items.filter((item) => item.isLive === false);

  const heuristics = new YoutubeHeuristics();

  const orderedTracks = heuristics.orderTracks({
    tracks,
    artist: query.artist,
    title: query.track
  });

  return orderedTracks
    .map((track) => videoToStreamData(track as Video, sourceName));
}

export const getStreamForId = async (id: string, sourceName: string, useSponsorBlock = true): Promise<StreamData> => {
  try {
    const videoUrl = baseUrl + id;
    const trackInfo = await ytdl.getInfo(videoUrl, { agent });
    const formatInfo = ytdl.chooseFormat(trackInfo.formats, { quality: 'highestaudio' });
    const segments = useSponsorBlock ? await SponsorBlock.getSegments(id) : [];

    return {
      id,
      source: sourceName,
      stream: formatInfo.url,
      duration: parseInt(trackInfo.videoDetails.lengthSeconds),
      title: trackInfo.videoDetails.title,
      thumbnail: getLargestThumbnail(trackInfo.videoDetails.thumbnails),
      format: formatInfo.container,
      skipSegments: segments,
      originalUrl: videoUrl,
      isLive: formatInfo.isLive,
      author: {
        name: trackInfo.videoDetails.author.name,
        thumbnail: getLargestThumbnail(trackInfo.videoDetails.author.thumbnails)
      }
    };
  } catch (e) {
    logger.error('Yotube - getStreamForId error');
    logger.error(e);
    throw new Error(`Could not find a Youtube track with ${id}`);
  }
};

function videoToStreamData(video: Video, source: string): StreamData {
  return {
    source,
    id: video.id,
    stream: undefined,
    duration: parseInt(video.duration),
    title: video.name,
    thumbnail: getLargestThumbnail(video.thumbnails),
    originalUrl: video.url,
    author: {
      name: video.author.name,
      thumbnail: getLargestThumbnail(video.thumbnails)
    }
  };
}

const getLargestThumbnail = (thumbnails: ytdl.thumbnail[]): string => {
  const isNotEmpty = thumbnails.length > 0;
  const largestThumbnail = isNotEmpty && thumbnails.reduce((prev, current) => {
    return (prev.height * prev.width) > (current.height * current.width) ? prev : current;
  });

  return largestThumbnail?.url;
};
