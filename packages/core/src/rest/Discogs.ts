import { isArray, mapValues } from 'lodash';
import querystring from 'querystring';

import { DiscogsSearchType, DiscogsRelease, DiscogsSearchArgs, DiscogsArtistReleaseSearchResult } from './Discogs.types';

const apiUrl = 'https://api.discogs.com/';
const userToken = 'QDUeFOZNwIwOePlxpVziEHzamhbIHUdfENAJTnLR';

function addToken(query: object): string {
  return `?${querystring.stringify({
    token: userToken,
    ...query
  })}`;
}

function searchQuery(terms: string, meta?: DiscogsSearchArgs, count = 15): string {
  // Strip # manually to prevent it being interpreted as anchor separator
  terms = terms.replace('#', '');

  return apiUrl + 'database/search' + addToken({
    q: terms,
    per_page: count,
    ...mapValues(meta, value => isArray(value) ? value.join(',') : value)
  });
}

function search(terms: string, type?: DiscogsSearchType | DiscogsSearchType[], meta?: DiscogsSearchArgs, count = 15): Promise<Response> {
  const query = searchQuery(terms, {type, ...meta}, count);
  return fetch(query);
}

function releaseInfo(
  releaseId: string,
  releaseType: DiscogsSearchType,
  release: DiscogsRelease
): Promise<Response> {
  const resource_url = release?.resource_url;
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

async function artistReleases(artistId: string): Promise<DiscogsArtistReleaseSearchResult[]> {
  const LOOKUP_LIMIT = 150;
  let hasMore = true;
  let releasesResults = [];
  let nextPageUrl = apiUrl + `artists/${artistId}/releases` + addToken({
    sort: 'year',
    sort_order: 'desc'
  });

  while (hasMore && releasesResults.length < LOOKUP_LIMIT) {
    const releases = await (await fetch(nextPageUrl)).json();

    releasesResults = [
      ...releasesResults,
      ...releases.releases
    ];

    hasMore = releases.pagination?.page < releases.pagination?.pages;
    nextPageUrl = releases.pagination?.urls?.next;
  }

  return releasesResults.filter(release => release.type === 'master');
}

export {
  search,
  releaseInfo,
  artistInfo,
  artistReleases
};
