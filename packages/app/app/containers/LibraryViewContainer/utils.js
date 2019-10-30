import _ from 'lodash';

export function sortTracks(tracks, criteria) {
  switch (criteria) {
  case 'artist':
    return _.sortBy(tracks, track => track.artist.name);
  case 'name':
    return _.sortBy(tracks, track => track.name);
  case 'album':
    return _.sortBy(tracks, track => track.album);
  default:
    return tracks;
  }
}
