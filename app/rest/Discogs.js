const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';

function addToken(query) {
  return query + '&token=' + userToken;
}

function searchQuery(terms) {
  return addToken(
    apiUrl
    + 'database/search'
    + '?q='
    + encodeURI(terms)
  );
}

function searchArtists(terms){
  return fetch(searchQuery(terms)
    + '&type=artist'
  );
}

function searchReleases(terms){
  return fetch(searchQuery(terms)
    + '&type=master'
  );
}

module.exports = {
  searchArtists,
  searchReleases
}
