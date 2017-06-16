const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';
const key = 'EZaGPpKGBbTkjwmpjmNY';
const secret = 'uluhDSPtelRtLUvjrvQhRBnNwpZMtkZq';

function addToken(query, first=false) {
  var newQuery = query + '&token=' + userToken;
  if (first)
    return newQuery.replace('&', '?');
  else
    return newQuery;
}

function addKeys(query, first=false) {
  var newQuery = query + '&key=' + key + '&secret=' + secret;
  if (first)
    return newQuery.replace('&', '?');
  else
    return newQuery;
}

function searchQuery(terms) {
  return addToken(
    apiUrl
    + 'database/search'
    + '?q='
    + encodeURI(terms)
  );
}

function searchArtists(terms) {
  return fetch(searchQuery(terms)
    + '&type=artist'
  );
}

function searchReleases(terms) {
  return fetch(searchQuery(terms)
    + '&type=master'
  );
}

function releaseInfo(releaseId) {
  return fetch(addToken(
    apiUrl
    + 'masters/'
    + releaseId
  , true));
}

module.exports = {
  searchArtists,
  searchReleases,
  releaseInfo
}
