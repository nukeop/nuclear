import { getOption } from '../persistence/store';
import { StreamData } from '../plugins/plugins.types';

const baseUrl = getOption('invidious.url');

const getTrackInfo = async (videoId) => {
  const response = await fetch(`${baseUrl}/api/v1/videos/${videoId}`);
  if (!response.ok) {
    throw new Error('invidious track info failed');
  }

  return response.json();
};

export const trackSearch = async (query: string, currentStream?: StreamData) => {
  const response =  await fetch(`${baseUrl}/api/v1/search?q=${query}&sortBy=relevance&page=1`);
  if (!response.ok) {
    throw new Error('invidious search failed');
  }
  const result = await response.json();

  result.shift();

  const track = currentStream
    ? result.find(({ videoId }) => currentStream.id !== videoId)
    : result[0];

  const trackInfo = await getTrackInfo(track.videoId);

  return trackInfo;
};
