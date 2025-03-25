import { getOption } from '../persistence/store';

export const baseUrl: string = getOption('invidious.url') as string;

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
