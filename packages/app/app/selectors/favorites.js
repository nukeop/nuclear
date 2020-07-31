import _ from 'lodash';

export function getFavoriteTrack(state, artist, title) {
  if (!artist || !title) {
    return null;
  }

  const normalizedArtist = _.deburr(artist.toLowerCase());
  const normalizedTitle = _.deburr(title.toLowerCase());

  return _.find(state.favorites.tracks, track => {
    const normalizedStoreArtist = _.deburr(_.defaultTo(track.artist.name, track.artist).toLowerCase());
    const normalizedStoreTitle = _.deburr(track.name.toLowerCase());

    return normalizedStoreArtist === normalizedArtist && normalizedStoreTitle === normalizedTitle;
  });
}
