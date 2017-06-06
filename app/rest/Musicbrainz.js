const NB = require('nodebrainz');
const nb = new NB({userAgent:'nuclear/0.4.0 ( https://github.com/nukeop/nuclear/ )'});

function artistSearch(terms) {
  return new Promise((fulfill, reject) => {
    nb.search('artist', {artist: terms}, (err, response) => {
      if (err) reject(err);
      else fulfill(response);
    });
  });
}

function releaseSearch(terms) {
  return new Promise((fulfill, reject) => {
    nb.search('release-group', {release: terms}, (err, response) => {
      if (err) reject(err);
      else fulfill(response);
    });
  });
}

function trackSearch(terms) {
  return new Promise((fulfill, reject) => {
    nb.search('work', {work: terms}, (err, response) => {
      if (err) reject(err);
      else fulfill(response);
    });
  });
}

module.exports = {
  artistSearch: artistSearch,
  releaseSearch: releaseSearch,
  trackSearch: trackSearch
}
