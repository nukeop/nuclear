import type { Playlist } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import { MOSAIC_SIZE } from '@nuclearplayer/ui';

const getUniqueTrackArtworkUrls = (playlist: Playlist): string[] => {
  const urls = playlist.items
    .map((item) => pickArtwork(item.track.artwork, 'cover', 300)?.url)
    .filter((url): url is string => url !== undefined);

  return [...new Set(urls)];
};

export const buildThumbnails = (playlist: Playlist): string[] => {
  const customUrl = pickArtwork(playlist.artwork, 'cover', 300)?.url;
  if (customUrl) {
    return [customUrl];
  }

  const uniqueUrls = getUniqueTrackArtworkUrls(playlist);

  if (uniqueUrls.length >= MOSAIC_SIZE) {
    return uniqueUrls.slice(0, MOSAIC_SIZE);
  }

  return uniqueUrls.slice(0, 1);
};
