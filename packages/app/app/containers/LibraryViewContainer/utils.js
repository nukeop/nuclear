import _ from 'lodash';

export function sortTracks(tracks, criteria) {
  switch (criteria) {
  case 'artist':
    return _.sortBy(tracks, ['artist.name', 'album', 'pos']);
  case 'name':
    return _.sortBy(tracks, ['name', 'artist.name']);
  case 'album':
    return _.sortBy(tracks, ['album', 'pos']);
  default:
    return tracks;
  }
}
