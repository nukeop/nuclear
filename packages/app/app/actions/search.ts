import logger from 'electron-timber';
import { rest } from '@nuclear/core';
import _ from 'lodash';
import artPlaceholder from '../../resources/media/art_placeholder.png';
import globals from '../globals';
import { error } from './toasts';
import { createAction } from 'redux-actions';
import { Search } from './actionTypes';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export const SearchActions = {
  unifiedSearchStart: createAction(Search.UNIFIED_SEARCH_START, (terms: string) => ({ terms })),
  unifiedSearchSuccess: createAction(Search.UNIFIED_SEARCH_SUCCESS),
  unifiedSearchError: createAction(Search.UNIFIED_SEARCH_ERROR),
  artistSearchSuccess: createAction(Search.ARTIST_SEARCH_SUCCESS, (data: any) => data),
  albumSearchSuccess: createAction(Search.ALBUM_SEARCH_SUCCESS, (data: any) => data),
  youtubePlaylistSearchStart: createAction(Search.YOUTUBE_PLAYLIST_SEARCH_START, (terms: string) => ({ terms })),
  youtubePlaylistSearchSuccess: createAction(Search.YOUTUBE_PLAYLIST_SEARCH_SUCCESS, (id: string, info: any) => ({ id, info })),
  youtubeLiveStreamSearchStart: createAction(Search.YOUTUBE_LIVESTREAM_SEARCH_START, (terms: string) => ({ terms })),
  youtubeLiveStreamSearchSuccess: createAction(Search.YOUTUBE_LIVESTREAM_SEARCH_SUCCESS, (id: string, info: any) => ({ id, info })),
  youtubeLiveStreamSearchError: createAction(Search.YOUTUBE_LIVESTREAM_SEARCH_ERROR, (terms: string, error: string) => ({ terms, error })),
  albumInfoStart: createAction(Search.ALBUM_INFO_SEARCH_START, (albumId: string) => ({ albumId })),
  albumInfoSuccess: createAction(Search.ALBUM_INFO_SEARCH_SUCCESS, (albumId: string, info: any) => ({ albumId, info })),
  albumInfoError: createAction(Search.ALBUM_INFO_SEARCH_ERROR, (albumId: string, error: string) => ({ albumId, error })),
  podcastSearchSuccess: createAction(Search.PODCAST_SEARCH_SUCCESS, (data: any) => data),
  setSearchDropdownVisibility: createAction(Search.SEARCH_DROPDOWN_DISPLAY_CHANGE, (displayState: boolean) => displayState),
  updateSearchHistory: createAction(Search.UPDATE_SEARCH_HISTORY, (searchHistory: string[]) => searchHistory)
};

export function sourcesSearch(terms, plugins) {
  const searchResults = {};
  for (let i = 0; i < plugins.streamProviders.length; i++) {
    Object.assign(searchResults, plugins.streamProviders[i].search(terms));
  }
  return {};
}

const getSelectedMetaProvider = (getState, wantedProvider = null) => {
  const {
    plugin: {
      plugins: { metaProviders }, selected }
  } = getState();

  return wantedProvider ?
    _.find(metaProviders, { searchName: wantedProvider }) :
    _.find(metaProviders, { sourceName: selected.metaProviders });
};

export const artistSearch = terms => async (dispatch, getState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForArtists(terms);
  dispatch(SearchActions.artistSearchSuccess(results));
};

export const albumSearch = terms => async (dispatch, getState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForReleases(terms);
  dispatch(SearchActions.albumSearchSuccess(results));
};

export const podcastSearch = terms => async (dispatch, getState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForPodcast(terms);
  dispatch(SearchActions.podcastSearchSuccess(results));
};

export function lastFmTrackSearchStart(terms) {
  return {
    type: Search.LASTFM_TRACK_SEARCH_START,
    payload: terms
  };
}

export function lastFmTrackSearchSuccess(terms, searchResults) {
  return {
    type: Search.LASTFM_TRACK_SEARCH_SUCCESS,
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

export function youtubePlaylistSearch(terms) {
  return dispatch => {
    dispatch(SearchActions.youtubePlaylistSearchStart(terms));
    rest.Youtube.urlSearch(terms)
      .then(results => {
        dispatch(
          SearchActions.youtubePlaylistSearchSuccess(terms, results)
        );
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export const youtubeLiveStreamSearch = (terms) => async (dispatch) => {
  dispatch(SearchActions.youtubeLiveStreamSearchStart(terms));
  try {
    const results = await rest.Youtube.liveStreamSearch(terms);
    dispatch(SearchActions.youtubeLiveStreamSearchSuccess(terms, results));
  } catch (e) {
    logger.error(e);
    dispatch(SearchActions.youtubeLiveStreamSearchError(terms, e));
  }
};

export function unifiedSearch(terms, history) {
  return dispatch => {
    dispatch(SearchActions.unifiedSearchStart(terms));

    Promise.all([
      dispatch(albumSearch(terms)),
      dispatch(artistSearch(terms)),
      dispatch(podcastSearch(terms)),
      dispatch(lastFmTrackSearch(terms)),
      dispatch(youtubePlaylistSearch(terms)),
      dispatch(youtubeLiveStreamSearch(terms))
    ])
      .then(() => {
        dispatch(SearchActions.unifiedSearchSuccess());
        if (history.location.pathname !== '/search') {
          history.push('/search');
        }
      })
      .catch(error => {
        logger.error(error);
        dispatch(SearchActions.unifiedSearchError());
      });
  };
}

export const albumInfoSearch = (albumId, releaseType = 'master', release) => async (dispatch, getState) => {
  dispatch(SearchActions.albumInfoStart(albumId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState);
    const albumDetails = await selectedProvider.fetchAlbumDetails(albumId, releaseType, release?.resourceUrl);
    dispatch(SearchActions.albumInfoSuccess(albumId, albumDetails));
  } catch (e) {
    logger.error(e);
    dispatch(SearchActions.albumInfoError(albumId, e));
  }
};

const artistInfoStart = artistId => ({
  type: Search.ARTIST_INFO_SEARCH_START,
  payload: { artistId }
});

const artistInfoSuccess = (artistId, info) => ({
  type: Search.ARTIST_INFO_SEARCH_SUCCESS,
  payload: { artistId, info }
});

const artistInfoError = (artistId, error) => ({
  type: Search.ARTIST_INFO_SEARCH_ERROR,
  payload: { artistId, error }
});

export const artistInfoSearch = (artistId, artist) => async (dispatch, getState) => {
  dispatch(artistInfoStart(artistId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState, artist?.source);
    const artistDetails = await selectedProvider.fetchArtistDetails(artistId, artist);
    dispatch(artistInfoSuccess(artistId, artistDetails));
  } catch (e) {
    logger.error(e);
    dispatch(artistInfoError(artistId, e));
  }
};

const artistReleasesStart = artistId => ({
  type: Search.ARTIST_RELEASES_SEARCH_START,
  payload: { artistId }
});

const artistReleasesSuccess = (artistId, releases) => ({
  type: Search.ARTIST_RELEASES_SEARCH_SUCCESS,
  payload: { artistId, releases }
});

const artistReleasesError = (artistId, error) => ({
  type: Search.ARTIST_RELEASES_SEARCH_ERROR,
  payload: { artistId, error }
});

export const artistReleasesSearch = (artistId, metaProvider = null) => async (dispatch, getState) => {
  dispatch(artistReleasesStart(artistId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState, metaProvider);
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
    _.invoke(history, 'push', '/artist/loading');
    dispatch(artistInfoStart('loading'));
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
    dispatch(SearchActions.albumInfoSuccess(albumDetails.id, albumDetails));
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
