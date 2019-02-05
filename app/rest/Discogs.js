const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';
const key = 'EZaGPpKGBbTkjwmpjmNY';
const secret = 'uluhDSPtelRtLUvjrvQhRBnNwpZMtkZq';

function replaceQuery(query, first) {
  if (first) {
    return query.replace('&', '?');
  }
  return query;
}

function addToken (query, first = false) {
  let newQuery = query + '&token=' + userToken;
  return replaceQuery(newQuery, first);
}

function addKeys (query, first = false) {
  let newQuery = query + '&key=' + key + '&secret=' + secret;
  return replaceQuery(newQuery, first);
}

function searchQuery (terms, count = 15) {
  // Strip # manually to prevent it being interpreted as anchor separator
  terms = terms.replace('#', '');

  return addToken(
    apiUrl + 'database/search' + '?q=' + encodeURI(terms) + '&per_page=' + count
  );
}

function search (terms, type, count = 15) {
  return fetch(searchQuery(terms, count) + '&type=' + type);
}

function releaseInfo (releaseId, releaseType) {
  if (releaseType === 'master') {
    return fetch(addToken(apiUrl + 'masters/' + releaseId, true));
  }
  else if (releaseType === 'release') {
    return fetch(addToken(apiUrl + 'releases/' + releaseId, true));
  }
}

function artistInfo (artistId) {
  return fetch(addToken(apiUrl + 'artists/' + artistId, true));
}

function artistReleases (artistId) {
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
  search,
  releaseInfo,
  artistInfo,
  artistReleases
};
