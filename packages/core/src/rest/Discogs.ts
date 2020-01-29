import _ from 'lodash';

const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';
// const key = 'EZaGPpKGBbTkjwmpjmNY';
// const secret = 'uluhDSPtelRtLUvjrvQhRBnNwpZMtkZq';

function addToken(query, first = false) {
  const newQuery = query + '&token=' + userToken;
  return first ? newQuery.replace('&', '?') : newQuery;
}

function searchQuery(terms, count = 15) {
  // Strip # manually to prevent it being interpreted as anchor separator
  terms = terms.replace('#', '');

  return addToken(
    apiUrl + 'database/search' + '?q=' + encodeURIComponent(terms) + '&per_page=' + count
  );
}

function search(terms, type?, count = 15) {
  let query = searchQuery(terms, count);
  if (!_.isNil(type)) {
    query += `&type=${type}`;
  }
  return fetch(query);
}

function releaseInfo(releaseId, releaseType, release) {
  /* eslint-disable @typescript-eslint/camelcase */
  const resource_url = _.get(release, 'resource_url');
  if (resource_url) {
    return fetch(addToken(resource_url, true));
  }

  if (releaseType === 'master') {
    return fetch(addToken(apiUrl + 'masters/' + releaseId, true));
  } else if (releaseType === 'release') {
    return fetch(addToken(apiUrl + 'releases/' + releaseId, true));
  }
  /* eslint-enable @typescript-eslint/camelcase */
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

export {
  search,
  releaseInfo,
  artistInfo,
  artistReleases
};
