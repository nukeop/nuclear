import logger from 'electron-timber';
import { rest } from '@nuclear/core';
import { getBestNewAlbums, getBestNewTracks } from 'pitchfork-bnm';
import { Deezer } from '@nuclear/core/src/rest';

import globals from '../globals';
import { Dashboard } from './actionTypes';
import { createAsyncAction } from 'typesafe-actions';

const lastfm = new rest.LastFmApi(
  globals.lastfmApiKey,
  globals.lastfmApiSecret
);

export const loadTopTagsAction = createAsyncAction(
  Dashboard.LOAD_TOP_TAGS_START,
  Dashboard.LOAD_TOP_TAGS_SUCCESS,
  Dashboard.LOAD_TOP_TAGS_ERROR
)<undefined, unknown, undefined>();

export function loadTopTags() {
  return dispatch => {
    dispatch(loadTopTagsAction.request());
    lastfm
      .getTopTags()
      .then(response => response.json())
      .then(results => {
        dispatch(loadTopTagsAction.success(results.toptags.tag));
      })
      .catch(error => {
        dispatch(loadTopTagsAction.failure());
        logger.error(error);
      });
  };
}

export const loadBestNewAlbumsAction = createAsyncAction(
  Dashboard.LOAD_BEST_NEW_ALBUMS_START,
  Dashboard.LOAD_BEST_NEW_ALBUMS_SUCCESS,
  Dashboard.LOAD_BEST_NEW_ALBUMS_ERROR
)<undefined, unknown, undefined>();

export function loadBestNewAlbums() {
  return dispatch => {
    dispatch(loadBestNewAlbumsAction.request());
    getBestNewAlbums()
      .then(albums => {
        dispatch(loadBestNewAlbumsAction.success(albums));
      })
      .catch(error => {
        dispatch(loadBestNewAlbumsAction.failure());
        logger.error(error);
      });
  };
}

export const loadBestNewTracksAction = createAsyncAction(
  Dashboard.LOAD_BEST_NEW_TRACKS_START,
  Dashboard.LOAD_BEST_NEW_TRACKS_SUCCESS,
  Dashboard.LOAD_BEST_NEW_TRACKS_ERROR
)<undefined, unknown, undefined>();

export function loadBestNewTracks() {
  return dispatch => {
    dispatch(loadBestNewTracksAction.request());
    getBestNewTracks()
      .then(tracks => {
        dispatch(loadBestNewTracksAction.success(tracks));
      })
      .catch(error => {
        dispatch(loadBestNewTracksAction.failure());
        logger.error(error);
      });
  };
}

export const loadTopTracksAction = createAsyncAction(
  Dashboard.LOAD_TOP_TRACKS_START,
  Dashboard.LOAD_TOP_TRACKS_SUCCESS,
  Dashboard.LOAD_TOP_TRACKS_ERROR
)<undefined, unknown, undefined>();

export const loadTopTracks = () => async (dispatch) => {
  dispatch(loadTopTracksAction.request());

  try {
    const tracks = await Deezer.getTopTracks();
    dispatch(loadTopTracksAction.success(tracks.data.map(Deezer.mapDeezerTrackToInternal)));
  } catch (error) {
    dispatch(loadTopTracksAction.failure());
    logger.error(error);
  }
};
