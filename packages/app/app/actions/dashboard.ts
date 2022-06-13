import logger from 'electron-timber';
import { rest } from '@nuclear/core';
import { getBestNewAlbums, getBestNewTracks } from 'pitchfork-bnm';

import globals from '../globals';
import { Dashboard } from './actionTypes';
import { createAsyncAction } from 'typesafe-actions';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';
import { DeezerTopTrack } from '@nuclear/core/src/rest/Deezer';

const lastfm = new rest.LastFmApi(
  globals.lastfmApiKey,
  globals.lastfmApiSecret
);

export type PitchforkAlbum = {
  abstract: string
  artist: string
  genres: string[]
  review: string
  reviewUrl: string
  score: string
  thumbnail: string
  title: string
}

export type PitchforkTrack = {
  artist: string
  review: string
  reviewUrl: string
  thumbnail: string
  title: string
}

export const loadTopTagsAction = createAsyncAction(
  Dashboard.LOAD_TOP_TAGS_START,
  Dashboard.LOAD_TOP_TAGS_SUCCESS,
  Dashboard.LOAD_TOP_TAGS_ERROR
)<undefined, LastfmTopTag[], undefined>();

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
)<undefined, PitchforkAlbum[], undefined>();

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
)<undefined, PitchforkTrack[], undefined>();

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
)<undefined, DeezerTopTrack[], undefined>();

export const loadTopTracks = () => async (dispatch) => {
  dispatch(loadTopTracksAction.request());

  try {
    const tracks = await rest.Deezer.getTopTracks();
    dispatch(loadTopTracksAction.success(tracks.data.map(rest.Deezer.mapDeezerTrackToInternal)));
  } catch (error) {
    dispatch(loadTopTracksAction.failure());
    logger.error(error);
  }
};
