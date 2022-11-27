import { getOption } from '../persistence/store';
import { StreamData } from '../plugins/plugins.types';

export const baseUrl = getOption('invidious.url');

export const getTrackInfo = async (videoId) => {
  const response = await fetch(`${baseUrl}/api/v1/videos/${videoId}`);
  if (!response.ok) {
    throw new Error('invidious track info failed');
  }

  return response.json();
};

export const trackSearch = async (query: string) => {
  const response =  await fetch(`${baseUrl}/api/v1/search?q=${query}&sortBy=relevance&page=1`);
  if (!response.ok) {
    throw new Error('invidious search failed');
  }
  const results = await response.json();
  results.shift();
  const tracks = await Promise.all(results.map(result => getTrackInfo(result.videoId)));

  return tracks;
};
