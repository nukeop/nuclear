import logger from 'electron-timber';
import { rest } from '@nuclear/core';
import _ from 'lodash';
import artPlaceholder from '../../resources/media/art_placeholder.png';
import globals from '../globals';
import { error } from './toasts';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export const UNIFIED_SEARCH_START = 'UNIFIED_SEARCH_START';
export const UNIFIED_SEARCH_SUCCESS = 'UNIFIED_SEARCH_SUCCESS';
export const UNIFIED_SEARCH_ERROR = 'UNIFIED_SEARCH_ERROR';

export const ARTIST_SEARCH_SUCCESS = 'ARTIST_SEARCH_SUCCESS';
export const ALBUM_SEARCH_SUCCESS = 'ALBUM_SEARCH_SUCCESS';

export const ALBUM_INFO_SEARCH_START = 'ALBUM_INFO_SEARCH_START';
export const ALBUM_INFO_SEARCH_SUCCESS = 'ALBUM_INFO_SEARCH_SUCCESS';
export const ALBUM_INFO_SEARCH_ERROR = 'ALBUM_INFO_SEARCH_ERROR';

export const ARTIST_INFO_SEARCH_START = 'ARTIST_INFO_SEARCH_START';
export const ARTIST_INFO_SEARCH_SUCCESS = 'ARTIST_INFO_SEARCH_SUCCESS';
export const ARTIST_INFO_SEARCH_ERROR = 'ARTIST_INFO_SEARCH_ERROR';

export const ARTIST_RELEASES_SEARCH_START = 'ARTIST_RELEASES_SEARCH_START';
export const ARTIST_RELEASES_SEARCH_SUCCESS = 'ARTIST_RELEASES_SEARCH_SUCCESS';
export const ARTIST_RELEASES_SEARCH_ERROR = 'ARTIST_RELEASES_SEARCH_ERROR';

export const LASTFM_TRACK_SEARCH_START = 'LASTFM_TRACK_SEARCH_START';
export const LASTFM_TRACK_SEARCH_SUCCESS = 'LASTFM_TRACK_SEARCH_SUCCESS';

export const YOUTUBE_PLAYLIST_SEARCH_START = 'YOUTUBE_PLAYLIST_SEARCH_START';
export const YOUTUBE_PLAYLIST_SEARCH_SUCCESS = 'YOUTUBE_PLAYLIST_SEARCH_SUCCESS';

export const SEARCH_DROPDOWN_DISPLAY_CHANGE = 'SEARCH_DROPDOWN_DISPLAY_CHANGE';

export function sourcesSearch(terms, plugins) {
  const searchResults = {};
  for (let i = 0; i < plugins.streamProviders.length; i++) {
    Object.assign(searchResults, plugins.streamProviders[i].search(terms));
  }
  return {};
}

const unifiedSearchStart = () => ({ type: UNIFIED_SEARCH_START });
const unifiedSearchSuccess = () => ({ type: UNIFIED_SEARCH_SUCCESS });
const unifiedSearchError = () => ({ type: UNIFIED_SEARCH_ERROR });

export const artistSearchSuccess = data => ({
  type: ARTIST_SEARCH_SUCCESS,
  payload: data
});

export const albumSearchSuccess = data => ({
  type: ALBUM_SEARCH_SUCCESS,
  payload: data
});

const getSelectedMetaProvider = getState => {
  const {
    plugin: {
      plugins: { metaProviders }, selected }
  } = getState();
  return _.find(metaProviders, { sourceName: selected.metaProviders });
};

export const artistSearch = terms => async (dispatch, getState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForArtists(terms);
  dispatch(artistSearchSuccess(results));
};

export const albumSearch = terms => async (dispatch, getState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForReleases(terms);
  dispatch(albumSearchSuccess(results));
};

export function lastFmTrackSearchStart(terms) {
  return {
    type: LASTFM_TRACK_SEARCH_START,
    payload: terms
  };
}

export function lastFmTrackSearchSuccess(terms, searchResults) {
  return {
    type: LASTFM_TRACK_SEARCH_SUCCESS,
    payload: {
      id: terms,
      info: searchResults
    }
  };
}

const isAcceptableLastFMThumbnail = thumbnail =>
  !(/https?:\/\/lastfm-img\d.akamaized.net\/i\/u\/\d+s\/2a96cbd8b46e442fc41c2b86b821562f\.png/.test(thumbnail));

const getTrackThumbnail = track => {
  const image =
    _.get(
      track,
      ['image', 1, '#text'],
      _.get(
        track,
        ['image', 0, '#text'],
        artPlaceholder
      )
    );
  return isAcceptableLastFMThumbnail(image) ? image : artPlaceholder;
};

export const mapLastFMTrackToInternal = track => ({
  ...track,
  thumbnail: getTrackThumbnail(track)
});

export function lastFmTrackSearch(terms) {
  return dispatch => {
    dispatch(lastFmTrackSearchStart(terms));
    Promise.all([lastfm.searchTracks(terms)])
      .then(results => Promise.all(results.map(info => info.json())))
      .then(results => {
        dispatch(
          lastFmTrackSearchSuccess(terms, _.get(results[0], 'results.trackmatches.track', []).map(mapLastFMTrackToInternal))
        );
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function youtubePlaylistSearchStart(terms) {
  return {
    type: YOUTUBE_PLAYLIST_SEARCH_START,
    payload: terms
  };
}

export function youtubePlaylistSearchSuccess(terms, results) {
  return {
    type: YOUTUBE_PLAYLIST_SEARCH_SUCCESS,
    payload: {
      id: terms,
      info: results
    }
  };
}

export function youtubePlaylistSearch(terms) {
  return dispatch => {
    dispatch(youtubePlaylistSearchStart(terms));
    rest.Youtube.urlSearch(terms)
      .then(results => {
        dispatch(
          youtubePlaylistSearchSuccess(terms, results)
        );
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function unifiedSearch(terms, history) {
  return dispatch => {
    dispatch(unifiedSearchStart());

    Promise.all([
      dispatch(albumSearch(terms)),
      dispatch(artistSearch(terms)),
      dispatch(lastFmTrackSearch(terms)),
      dispatch(youtubePlaylistSearch(terms))
    ])
      .then(() => {
        dispatch(unifiedSearchSuccess());
        if (history.location.pathname !== '/search') {
          history.push('/search');
        }
      })
      .catch(error => {
        logger.error(error);
        dispatch(unifiedSearchError());
      });
  };
}

const albumInfoStart = albumId => ({
  type: ALBUM_INFO_SEARCH_START,
  payload: { albumId }
});

const albumInfoSuccess = (albumId, info) => ({
  type: ALBUM_INFO_SEARCH_SUCCESS,
  payload: { albumId, info }
});

const albumInfoError = (albumId, error) => ({
  type: ALBUM_INFO_SEARCH_ERROR,
  payload: { albumId, error }
});

export const albumInfoSearch = (albumId, releaseType = 'master', release) => async (dispatch, getState) => {
  dispatch(albumInfoStart(albumId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState);
    const albumDetails = await selectedProvider.fetchAlbumDetails(albumId, releaseType, _.get(release, 'resource_url'));
    dispatch(albumInfoSuccess(albumId, albumDetails));
  } catch (e) {
    logger.error(e);
    dispatch(albumInfoError(albumId, e));
  }
};

const artistInfoStart = artistId => ({
  type: ARTIST_INFO_SEARCH_START,
  payload: { artistId }
});

const artistInfoSuccess = (artistId, info) => ({
  type: ARTIST_INFO_SEARCH_SUCCESS,
  payload: { artistId, info }
});

const artistInfoError = (artistId, error) => ({
  type: ARTIST_INFO_SEARCH_ERROR,
  payload: { artistId, error }
});

export const artistInfoSearch = artistId => async (dispatch, getState) => {
  dispatch(artistInfoStart(artistId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState);
    const artistDetails = await selectedProvider.fetchArtistDetails(artistId);
    dispatch(artistInfoSuccess(artistId, artistDetails));
  } catch (e) {
    logger.error(e);
    dispatch(artistInfoError(artistId, e));
  }
};

const artistReleasesStart = artistId => ({
  type: ARTIST_RELEASES_SEARCH_START,
  payload: { artistId }
});

const artistReleasesSuccess = (artistId, releases) => ({
  type: ARTIST_RELEASES_SEARCH_SUCCESS,
  payload: { artistId, releases }
});

const artistReleasesError = (artistId, error) => ({
  type: ARTIST_RELEASES_SEARCH_ERROR,
  payload: { artistId, error }
});

export const artistReleasesSearch = artistId => async (dispatch, getState) => {
  dispatch(artistReleasesStart(artistId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState);
    const artistAlbums = await selectedProvider.fetchArtistAlbums(artistId);
    dispatch(artistReleasesSuccess(artistId, artistAlbums));
  } catch (e) {
    logger.error(e);
    dispatch(artistReleasesError(artistId, e));
  }
};

export const artistInfoSearchByName = (artistName, history) => async (dispatch, getState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const { settings } = getState();
  try {
    const artistDetails = await selectedProvider.fetchArtistDetailsByName(artistName);
    dispatch(artistInfoSuccess(artistDetails.id, artistDetails));
    _.invoke(history, 'push', `/artist/${artistDetails.id}`);
  } catch (e) {
    logger.error(e);
    dispatch(error(
      `Failed to find artist ${artistName}`,
      `Using ${selectedProvider.sourceName}`,
      null, settings
    ));
  }
};

export const albumInfoSearchByName = (albumName, history) => async (dispatch, getState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const { settings } = getState();
  try {
    const albumDetails = await selectedProvider.fetchAlbumDetailsByName(albumName);
    dispatch(albumInfoSuccess(albumDetails.id, albumDetails));
    _.invoke(history, 'push', `/album/${albumDetails.id}`);
  } catch (e) {
    logger.error(e);
    dispatch(error(
      `Failed to find album ${albumName}`,
      `Using ${selectedProvider.sourceName}`,
      null, settings
    ));
  }
};

export const setSearchDropdownVisibility = displayState => ({
  type: SEARCH_DROPDOWN_DISPLAY_CHANGE,
  payload: displayState
});
