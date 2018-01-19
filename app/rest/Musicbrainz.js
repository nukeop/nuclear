const NB = require('nodebrainz');
const nb = new NB({userAgent:'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0'});
const covers = require('./CoverArtArchive');

function artistSearch(terms) {
  return new Promise((fulfill, reject) => {
    nb.search('artist', {artist: terms}, (err, response) => {
      if (err) reject(err);
      else fulfill(response);
    });
  });
}

function addCoversToReleases(searchResults) {
    var coverPromises = searchResults['release-groups'].map(group => {
      return covers.releaseGroupFront(group);
    });

    return Promise.all(coverPromises);
}

function releaseSearch(terms) {
  var nbSearch = new Promise((fulfill, reject) => {
    nb.search('release-group', {release: terms}, (err, response) => {
      if (err) reject(err);
      else fulfill(response);
    })
  });

  return nbSearch;
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
  artistSearch,
  releaseSearch,
  trackSearch,
  addCoversToReleases
};
