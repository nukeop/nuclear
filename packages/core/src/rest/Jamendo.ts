export function search (query) {
  const limit = 10;
  const url =
    'https://api.jamendo.com/v3.0/artists/tracks/' +
    '?client_id=' +
    process.env.JAMENDO_CLIENT_ID +
    '&format=jsonpretty' +
    '&limit=' +
    limit +
    '&name=' +
    encodeURIComponent(query.artist) +
    '&track_name=' +
    encodeURIComponent(query.track);

  return fetch(url);
}
