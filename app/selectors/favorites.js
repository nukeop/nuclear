import _ from 'lodash';

export function getFavoriteTrack(state, artist, title) {
  if (!artist || !title) {
    return null;
  }

  const normalizedArtist = _.deburr(artist.toLowerCase());
  const normalizedTitle = _.deburr(title.toLowerCase());

  return _.find(state.favorites.tracks, track => {
    const normalizedStoreArtist = _.deburr(track.artist.name.toLowerCase());
    const normalizedStoreTitle = _.deburr(track.name.toLowerCase());

    return normalizedStoreArtist === normalizedArtist && normalizedStoreTitle === normalizedTitle;
  });
}

export function getFavoriteAlbum(state, artist, title) {
  if (!artist || !title) {
    return null;
  }

  const normalizedArtist = _.deburr(artist.toLowerCase());
  const normalizedTitle = _.deburr(title.toLowerCase());

  return _.find(state.favorites.albums, album => {
    const albumArtist = album.artists[0];

    if (!albumArtist) {
      return false;
    }

    const artistQuantifierRegex = /\s\([0-9]*\)$/;
    const normalizedStoreArtist = _.deburr(albumArtist.name.toLowerCase().replace(artistQuantifierRegex, ''));
    const normalizedStoreTitle = _.deburr(album.title.toLowerCase());

    return normalizedStoreArtist === normalizedArtist && normalizedStoreTitle === normalizedTitle;
  });
}
