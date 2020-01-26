const apiUrl = 'https://api.soundcloud.com';

function prepareUrl(url) {
  return `${url}&client_id=${process.env.SOUNDCLOUD_API_KEY}`;
}

export function soundcloudSearch(terms) {
  return fetch(prepareUrl(apiUrl + '/tracks?limit=50&q=' + terms));
}
