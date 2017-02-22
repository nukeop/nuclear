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

module.exports = {
  musicbrainzSearch: musicbrainzSearch
}
