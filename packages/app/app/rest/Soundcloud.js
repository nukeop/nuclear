import globals from '../globals';
const apiUrl = 'https://api.soundcloud.com';

function prepareUrl(url) {
  return `${url}&client_id=${globals.soundcloudApiKey}`;
}

export function soundcloudSearch(terms) {
  return fetch(prepareUrl(apiUrl + '/tracks?limit=50&q=' + terms));
}
