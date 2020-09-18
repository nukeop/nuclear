export const ENDPOINT = 'https://discoveryprovider.audius.co/v1';


export function artistSearch(query: string): Promise<Response> {
  return fetch(ENDPOINT + '/users/search?query=' + query);
}

export function getArtist(id: string): Promise<Response> {
  return fetch(ENDPOINT + '/users/' + id);
}

export function getArtistTracks(id: string): Promise<Response> {
  return fetch(ENDPOINT + '/users/' + id + '/tracks');
}

export function trackSearch(query: string): Promise<Response> {
  return fetch(ENDPOINT + '/tracks/search?query=' + query);
}
