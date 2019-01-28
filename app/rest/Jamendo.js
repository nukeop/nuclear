import globals from '../globals';

export function search(query) {
  let limit = 10;
  let url = encodeURI(
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
