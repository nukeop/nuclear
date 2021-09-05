const apiUrl = 'https://api.soundcloud.com';

function prepareUrl(url: string): string {
  return `${url}&client_id=${process.env.SOUNDCLOUD_API_KEY}`;
}

export function soundcloudSearch(terms: string): Promise<Response> {
  return fetch(prepareUrl(apiUrl + '/tracks?limit=50&q=' + terms));
}

export function getTrackById(id: string): Promise<Response> {
  return fetch(prepareUrl(`${apiUrl}/tracks/${id}`));
}
