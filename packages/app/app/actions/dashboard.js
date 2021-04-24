import logger from 'electron-timber';
import { rest } from '@nuclear/core';
import { getBestNewAlbums, getBestNewTracks } from 'pitchfork-bnm';

import globals from '../globals';
import { Deezer } from '@nuclear/core/src/rest';

const lastfm = new rest.LastFmApi(
  globals.lastfmApiKey,
  globals.lastfmApiSecret
);

export const LOAD_BEST_NEW_ALBUMS_START = 'LOAD_BEST_NEW_ALBUMS_START';
export const LOAD_BEST_NEW_ALBUMS_SUCCESS = 'LOAD_BEST_NEW_ALBUMS_SUCCESS';
export const LOAD_BEST_NEW_ALBUMS_ERROR = 'LOAD_BEST_NEW_ALBUMS_ERROR';

export const LOAD_BEST_NEW_TRACKS_START = 'LOAD_BEST_NEW_TRACKS_START';
export const LOAD_BEST_NEW_TRACKS_SUCCESS = 'LOAD_BEST_NEW_TRACKS_SUCCESS';
export const LOAD_BEST_NEW_TRACKS_ERROR = 'LOAD_BEST_NEW_TRACKS_ERROR';

export const LOAD_TOP_TAGS_START = 'LOAD_TOP_TAGS_START';
export const LOAD_TOP_TAGS_SUCCESS = 'LOAD_TOP_TAGS_SUCCESS';
export const LOAD_TOP_TAGS_ERROR = 'LOAD_TOP_TAGS_ERROR';

export const LOAD_TOP_TRACKS_START = 'LOAD_TOP_TRACKS_START';
export const LOAD_TOP_TRACKS_SUCCESS = 'LOAD_TOP_TRACKS_SUCCESS';
export const LOAD_TOP_TRACKS_ERROR = 'LOAD_TOP_TRACKS_ERROR';

export function loadTopTagsStart() {
  return {
    type: LOAD_TOP_TAGS_START
  };
}

export function loadTopTagsSuccess(tags) {
  return {
    type: LOAD_TOP_TAGS_SUCCESS,
    payload: tags
  };
}

export function loadTopTagsError() {
  return {
    type: LOAD_TOP_TAGS_ERROR
  };
}

export function loadTopTags() {
  return dispatch => {
    dispatch(loadTopTagsStart());
    lastfm
      .getTopTags()
      .then(response => response.json())
      .then(results => {
        dispatch(loadTopTagsSuccess(results.toptags.tag));
      })
      .catch(error => {
        dispatch(loadTopTagsError());
        logger.error(error);
      });
  };
}

export function loadBestNewAlbumsStart() {
  return {
    type: LOAD_BEST_NEW_ALBUMS_START
  };
}

export function loadBestNewAlbumsSuccess(albums) {
  return {
    type: LOAD_BEST_NEW_ALBUMS_SUCCESS,
    payload: albums
  };
}

export function loadBestNewAlbumsError() {
  return {
    type: LOAD_BEST_NEW_ALBUMS_ERROR
  };
}

export function loadBestNewAlbums() {
  return dispatch => {
    dispatch(loadBestNewAlbumsStart());
    getBestNewAlbums()
      .then(albums => {
        dispatch(loadBestNewAlbumsSuccess(albums));
      })
      .catch(error => {
        dispatch(loadBestNewAlbumsError());
        logger.error(error);
      });
  };
}

export function loadBestNewTracksStart() {
  return {
    type: LOAD_BEST_NEW_TRACKS_START
  };
}

export function loadBestNewTracksSuccess(tracks) {
  return {
    type: LOAD_BEST_NEW_TRACKS_SUCCESS,
    payload: tracks
  };
}

export function loadBestNewTracksError() {
  return {
    type: LOAD_BEST_NEW_TRACKS_ERROR
  };
}

export function loadBestNewTracks() {
  return dispatch => {
    dispatch(loadBestNewAlbumsStart());
    getBestNewTracks()
      .then(tracks => {
        dispatch(loadBestNewTracksSuccess(tracks));
      })
      .catch(error => {
        dispatch(loadBestNewTracksError());
        logger.error(error);
      });
  };
}

export function loadTopTracksStart() {
  return {
    type: LOAD_TOP_TRACKS_START
  };
}

export function loadTopTracksSuccess(tracks) {
  return {
    type: LOAD_TOP_TRACKS_SUCCESS,
    payload: tracks
  };
}

export function loadTopTracksError() {
  return {
    type: LOAD_TOP_TRACKS_ERROR
  };
}

export const loadTopTracks = () => async (dispatch) => {
  dispatch(loadTopTracksStart());

  try {
    const tracks = await Deezer.getTopTracks();
    dispatch(loadTopTracksSuccess(tracks.data.map(Deezer.mapDeezerTrackToInternal)));
  } catch (error) {
    dispatch(loadTopTracksError());
    logger.error(error);
  }
};
