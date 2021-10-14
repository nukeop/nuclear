export type JamendoTrackInfo = {
  'id': string;
  'name': string;
  'duration': number;
  'artist_id': string;
  'artist_name': string;
  'artist_idstr': string;
  'album_name': string;
  'album_id': string;
  'license_ccurl': string;
  'position': number,
  'releasedate': string;
  'album_image': string;
  'audio': string;
  'audiodownload': string;
  'prourl': string;
  'shorturl': string;
  'shareurl': string;
  'waveform': string;
  'image': string;
  'audiodownload_allowed': boolean;
}
export function search (query): Promise<Response> {
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

export function getTrackById (id: string): Promise<Response> {
  const url =
    'https://api.jamendo.com/v3.0/tracks/' +
    '?client_id=' +
    process.env.JAMENDO_CLIENT_ID +
    '&format=jsonpretty' +
    '&id=' +
    encodeURIComponent(id);

  return fetch(url);
}
