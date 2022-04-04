import _, { isString } from 'lodash';
import { createStateSelectors } from './helpers';

type Name = string | {
  name: string;
};

export function getFavoriteTrack(state, artist: Name, title: Name) {
  if (!artist || !title) {
    return null;
  }

  const resolvedArtist = isString(artist) 
    ? artist
    : artist.name;

  const resolvedTitle = isString(title)
    ? title
    : title.name;

  const normalizedArtist = _.deburr(resolvedArtist.toLowerCase());
  const normalizedTitle = _.deburr(resolvedTitle.toLowerCase());

  return _.find(state.favorites.tracks, track => {
    const normalizedStoreArtist = _.deburr(_.defaultTo(track.artist.name, track.artist).toLowerCase());
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
