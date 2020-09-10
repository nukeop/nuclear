export const ENDPOINT = 'https://discoveryprovider.audius.co/v1';

export function trackSearch(query: string): Promise<Response> {
  return fetch(ENDPOINT + '/tracks/search?query=' + query);
}
