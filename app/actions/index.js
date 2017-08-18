const mb = require('../rest/Musicbrainz');
const discogs = require('../rest/Discogs');
const lastfm = require('../rest/Lastfm');

const _ = require('lodash');

export const UNIFIED_SEARCH_START = 'UNIFIED_SEARCH_START';
export const UNIFIED_SEARCH_SUCCESS = 'UNIFIED_SEARCH_SUCCESS';
export const UNIFIED_SEARCH_ERROR = 'UNIFIED_SEARCH_ERROR';

export const ARTIST_SEARCH_SUCCESS = 'ARTIST_SEARCH_SUCCESS';
export const ALBUM_SEARCH_SUCCESS = 'ALBUM_SEARCH_SUCCESS';

export const ALBUM_INFO_SEARCH_START = 'ALBUM_INFO_SEARCH_START';
export const ALBUM_INFO_SEARCH_SUCCESS = 'ALBUM_INFO_SEARCH_SUCCESS';

export const ARTIST_INFO_SEARCH_START = 'ARTIST_INFO_SEARCH_START';
export const ARTIST_INFO_SEARCH_SUCCESS = 'ARTIST_INFO_SEARCH_SUCCESS';

export const ARTIST_RELEASES_SEARCH_START = 'ARTIST_RELEASES_SEARCH_START';
export const ARTIST_RELEASES_SEARCH_SUCCESS = 'ARTIST_RELEASES_SEARCH_SUCCESS';

export const LASTFM_ARTIST_INFO_SEARCH_START = 'LASTFM_ARTIST_INFO_SEARCH_START';
export const LASTFM_ARTIST_INFO_SEARCH_SUCCESS = 'LASTFM_ARTIST_INFO_SEARCH_SUCCESS';

export function sourcesSearch(terms, plugins) {
  var searchResults = {};
  for(var i=0; i<plugins.musicSources.length; i++) {
    Object.assign(searchResults, plugins.musicSources[i].search(terms));
  }

  return {
    type: SOURCES_SEARCH
  }
}

export function unifiedSearchStart() {
  return {
    type: UNIFIED_SEARCH_START,
    payload: true
  }
}

export function unifiedSearchSuccess() {
  return {
    type: UNIFIED_SEARCH_SUCCESS,
    payload: false
  }
}

export function albumSearch(terms) {
  return (dispatch) => {
    discogs.searchReleases(terms)
    .then(searchResults => searchResults.json())
    .then(searchResultsJson => {
      dispatch({
        type: ALBUM_SEARCH_SUCCESS,
        payload: searchResultsJson.results
      });
    });
  }
}

export function artistSearch(terms) {
  return (dispatch) => {
    discogs.searchArtists(terms)
    .then(searchResults => searchResults.json())
    .then(searchResultsJson => {
      dispatch({
        type: ARTIST_SEARCH_SUCCESS,
        payload: searchResultsJson.results
      });
    });
  }
}

export function unifiedSearch(terms) {
  return (dispatch) => {
    dispatch(unifiedSearchStart());
    Promise.all([
      dispatch(albumSearch(terms)),
      dispatch(artistSearch(terms))
    ]).then(() => {
      setTimeout(() => dispatch(unifiedSearchSuccess()), 2000);
    });
  };
}

export function albumInfoStart(albumId) {
  return {
    type: ALBUM_INFO_SEARCH_START,
    payload: albumId
  }
}

export function albumInfoSuccess(albumId, info) {
  return {
    type: ALBUM_INFO_SEARCH_SUCCESS,
    payload: {
      id: albumId,
      info: info
    }
  }
}

export function albumInfoSearch(albumId) {
  return (dispatch) => {
    dispatch(albumInfoStart(albumId));
    discogs.releaseInfo(albumId)
    .then (info => info.json())
    .then (albumInfo => {
      dispatch(albumInfoSuccess(albumId, albumInfo));
    });
  };
}

export function artistInfoStart(artistId) {
  return {
    type: ARTIST_INFO_SEARCH_START,
    payload: artistId
  }
}

export function artistInfoSuccess(artistId, info) {
  return {
    type: ARTIST_INFO_SEARCH_SUCCESS,
    payload: {
      id: artistId,
      info: info
    }
  }
}

export function artistInfoSearch(artistId) {
  return (dispatch) => {
    dispatch(artistInfoStart(artistId));
    discogs.artistInfo(artistId)
    .then (info => info.json())
    .then (artistInfo => {
      dispatch(artistInfoSuccess(artistId, artistInfo));
      dispatch(lastFmArtistInfoSearch(artistInfo.name, artistId));
    });
  };
}

export function artistReleasesStart(artistId) {
  return {
    type: ARTIST_RELEASES_SEARCH_START,
    payload: artistId
  }
}

export function artistReleasesSuccess(artistId, releases) {
  return {
    type: ARTIST_RELEASES_SEARCH_SUCCESS,
    payload: {
      id: artistId,
      releases: releases
    }
  }
}

export function artistReleasesSearch(artistId) {
  return (dispatch) => {
    dispatch(artistReleasesStart(artistId));
    discogs.artistReleases(artistId)
    .then (releases => releases.json())
    .then (releases => {
      dispatch(artistReleasesSuccess(artistId, releases));
    });
  };
}

export function lastFmArtistInfoStart(artistId) {
  return {
    type: LASTFM_ARTIST_INFO_SEARCH_START,
    payload: artistId
  }
}

export function lastFmArtistInfoSuccess(artistId, info) {
  return {
    type: LASTFM_ARTIST_INFO_SEARCH_SUCCESS,
    payload: {
      id: artistId,
      info: info
    }
  }
}

export function lastFmArtistInfoSearch(artist, artistId) {
  return dispatch => {
    dispatch(lastFmArtistInfoStart(artistId));
    lastfm.getArtistInfo(artist)
    .then (info => info.json())
    .then (info => {
      dispatch(lastFmArtistInfoSuccess(artistId, info));
    });
  };
}
