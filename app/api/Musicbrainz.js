const mb = require('musicbrainz');

function musicbrainzSearch(searchTerms, searchStartCallback, searchEndCallback, resultsChangeCallback) {
  var results = [];
  searchStartCallback();

  mb.searchReleases(searchTerms, {}, (err, releases) => {
    releases.map((el, i) => {
      el.load(['artists'], () => {
          results.push(el);
          resultsChangeCallback(el);
      });
    });

    searchEndCallback(searchTerms, results);
  });
}

function musicbrainzLookup(releaseId, callback) {
  mb.lookupRelease(releaseId, {}, (err, result) => {
    callback(result);
  });
}

module.exports = {
  musicbrainzSearch: musicbrainzSearch,
  musicbrainzLookup: musicbrainzLookup
}
