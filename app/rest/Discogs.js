const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';
const key = 'EZaGPpKGBbTkjwmpjmNY';
const secret = 'uluhDSPtelRtLUvjrvQhRBnNwpZMtkZq';

function addToken(query, first = false) {
  var newQuery = query + '&token=' + userToken;
  if (first) return newQuery.replace('&', '?');
  else return newQuery;
}

function addKeys(query, first = false) {
  var newQuery = query + '&key=' + key + '&secret=' + secret;
  if (first) return newQuery.replace('&', '?');
  else return newQuery;
}

function searchQuery(terms, count = 15) {
  // Strip # manually to prevent it being interpreted as anchor separator
  terms = terms.replace('#', '');

  return addToken(
    apiUrl + 'database/search' + '?q=' + encodeURI(terms) + '&per_page=' + count
  );
}

function searchArtists(terms, count = 15) {
  return fetch(searchQuery(terms, count) + '&type=artist');
}

function searchReleases(terms, count = 15) {
  return fetch(searchQuery(terms, count) + '&type=master');
}

function releaseInfo(releaseId) {
  return fetch(addToken(apiUrl + 'masters/' + releaseId, true));
}

function artistInfo(artistId) {
  return fetch(addToken(apiUrl + 'artists/' + artistId, true));
}

function artistReleases(artistId) {
  return fetch(
    addToken(
      apiUrl +
        'artists/' +
        artistId +
        '/releases' +
        '?sort=year&sort_order=desc',
      false
    )
  );
}

module.exports = {
  searchArtists,
  searchReleases,
  releaseInfo,
  artistInfo,
  artistReleases,
};
