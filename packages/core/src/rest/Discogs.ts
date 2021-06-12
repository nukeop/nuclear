import _ from 'lodash';

import { DiscogsSearchType, DiscogsRelease } from './Discogs.types';

const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';
// const key = 'EZaGPpKGBbTkjwmpjmNY';
// const secret = 'uluhDSPtelRtLUvjrvQhRBnNwpZMtkZq';

function addToken(query: string, first = false): string {
  const newQuery: string = query + '&token=' + userToken;
  return first ? newQuery.replace('&', '?') : newQuery;
}

function searchQuery(terms: string, count = 15): string {
  // Strip # manually to prevent it being interpreted as anchor separator
  terms = terms.replace('#', '');

  return addToken(
    apiUrl + 'database/search' + '?q=' + encodeURIComponent(terms) + '&per_page=' + count
  );
}

function search(terms: string, type?: DiscogsSearchType, count = 15): Promise<Response> {
  let query = searchQuery(terms, count);
  if (!_.isNil(type)) {
    query += `&type=${type}`;
  }
  return fetch(query);
}

function releaseInfo(
  releaseId: string,
  releaseType: DiscogsSearchType,
  release: DiscogsRelease
): Promise<Response> {
  const resource_url = _.get(release, 'resource_url');
  if (resource_url) {
    return fetch(addToken(resource_url, true));
  }

  if (releaseType === 'master') {
    return fetch(addToken(apiUrl + 'masters/' + releaseId, true));
  } else if (releaseType === 'release') {
    return fetch(addToken(apiUrl + 'releases/' + releaseId, true));
  }
}

function artistInfo(artistId: string): Promise<Response> {
  return fetch(addToken(apiUrl + 'artists/' + artistId, true));
}

function artistReleases(artistId: string): Promise<Response> {
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
