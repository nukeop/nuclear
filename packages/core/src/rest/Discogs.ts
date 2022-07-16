import _ from 'lodash';
import querystring from 'querystring';

import { DiscogsSearchType, DiscogsRelease } from './Discogs.types';

const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';

function addToken(query: object): string {
  return `?${querystring.stringify({
    token: userToken,
    ...query
  })}`;
}

function searchQuery(terms: string, meta?: object, count = 15): string {
  // Strip # manually to prevent it being interpreted as anchor separator
  terms = terms.replace('#', '');

  return apiUrl + 'database/search' + addToken({
    q: terms,
    per_page: count,
    ...meta
  });
}

function search(terms: string, type?: DiscogsSearchType, meta?: object, count = 15): Promise<Response> {
  const query = searchQuery(terms, {type, ...meta}, count);
  return fetch(query);
}

function releaseInfo(
  releaseId: string,
  releaseType: DiscogsSearchType,
  release: DiscogsRelease
): Promise<Response> {
  const resource_url = _.get(release, 'resource_url');
  if (resource_url) {
    return fetch(resource_url + addToken({}));
  }

  if (releaseType === 'master') {
    return fetch(apiUrl + 'masters/' + releaseId + addToken({}));
  } else if (releaseType === 'release') {
    return fetch(apiUrl + 'releases/' + releaseId + addToken({}));
  }
}

function artistInfo(artistId: string): Promise<Response> {
  return fetch(apiUrl + 'artists/' + artistId + addToken({}));
}

function artistReleases(artistId: string): Promise<Response> {
  return fetch(
    apiUrl +
    `artists/${artistId}/releases` +
    addToken({
      sort: 'year',
      sort_order: 'desc'
    })
  );
}

export {
  search,
  releaseInfo,
  artistInfo,
  artistReleases
};
