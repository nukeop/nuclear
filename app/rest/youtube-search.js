import { getOption } from '../persistence/store';

export function prepareUrl (url) {
  return `${url}&key=${ getOption('yt.apiKey')}`;
}

export function trackSearch (track) {
  return fetch(prepareUrl('https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q=' + encodeURIComponent(track)));
}
