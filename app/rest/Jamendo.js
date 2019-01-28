import globals from '../globals';

export function search (query) {
  const limit = 10;
  const url = encodeURI(
    'https://api.jamendo.com/v3.0/artists/tracks/' +
    '?client_id=' +
    globals.jamendoClientId +
    '&format=jsonpretty' +
    '&limit=' +
    limit +
    '&name=' +
    query.artist +
    '&track_name=' +
    query.track
  );

  return fetch(url);
}
