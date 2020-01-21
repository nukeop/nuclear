import { getOption } from '../persistence/store';

const baseUrl = getOption('invidious.url');

export const trackSearch = async (query, alternate) => {
  const response =  await fetch(`${baseUrl}/api/v1/search?q=${query}&sortBy=relevance&page=1`);
  if (!response.ok) {
    throw new Error('invidious search failed');
  }
  const result = await response.json();

  const trackInfo = await getTrackInfo(result[alternate ? 1 : 0].videoId);

  return trackInfo;
};

const getTrackInfo = async (videoId) => {
  const response = await fetch(`${baseUrl}/api/v1/videos/${videoId}`);
  if (!response.ok) {
    throw new Error('invidious track info failed');
  }

  return response.json();
};
