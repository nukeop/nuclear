import _, { isString } from 'lodash';
import { createStateSelectors } from './helpers';

type Name = string | {
  name: string;
};

export function getFavoriteTrack(state, artists?: string[], title?: Name) {
  if (!artists || !title) {
    return null;
  }

  const resolvedTitle = isString(title)
    ? title
    : title.name;

  const normalizedArtist = _.deburr(artists?.[0]?.toLowerCase());
  const normalizedTitle = _.deburr(resolvedTitle.toLowerCase());

  return _.find(state.favorites.tracks, track => {
    const normalizedStoreArtist = _.deburr(track.artists?.[0]?.toLowerCase());
    const normalizedStoreTitle = _.deburr(track.name.toLowerCase());

    return normalizedStoreArtist === normalizedArtist && normalizedStoreTitle === normalizedTitle;
  });
}

export const favoritesSelectors = createStateSelectors(
  'favorites',
  [
    'tracks',
    'albums',
    'artists'
  ]
);
