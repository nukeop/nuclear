import globals from '../globals';

function prepareUrl(url) {
  return `${url}&key=${globals.ytApiKey}`;
}

function trackSearch(track) {
  return fetch(prepareUrl("https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&maxResults=50&q="+encodeURIComponent(track)));
}

module.exports = {
  trackSearch
};
