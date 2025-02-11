import { logger } from '@nuclear/core';
import { createAsyncAction } from 'typesafe-actions';

import { rest } from '@nuclear/core';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';
import { DeezerEditorialCharts, mapDeezerTrackToInternal } from '@nuclear/core/src/rest/Deezer';

import globals from '../globals';
import { Dashboard } from './actionTypes';

const lastfm = new rest.LastFmApi(
  globals.lastfmApiKey,
  globals.lastfmApiSecret
);

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

export const loadTopTracksAction = createAsyncAction(
  Dashboard.LOAD_TOP_TRACKS_START,
  Dashboard.LOAD_TOP_TRACKS_SUCCESS,
  Dashboard.LOAD_TOP_TRACKS_ERROR
)<undefined, ReturnType<typeof mapDeezerTrackToInternal>[], undefined>();

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

export const loadEditorialChartsAction = createAsyncAction(
  Dashboard.LOAD_EDITORIAL_CHARTS_START,
  Dashboard.LOAD_EDITORIAL_CHARTS_SUCCESS,
  Dashboard.LOAD_EDITORIAL_CHARTS_ERROR
)<undefined, DeezerEditorialCharts, string>();

export const loadEditorialCharts = () => async (dispatch) => {
  dispatch(loadEditorialChartsAction.request());

  try {
    const charts = await rest.Deezer.getEditorialCharts();
    dispatch(loadEditorialChartsAction.success(charts));
  } catch (error) {
    dispatch(loadEditorialChartsAction.failure(error.message));
    logger.error(error);
  }
};

export const loadEditorialPlaylistAction = createAsyncAction(
  Dashboard.LOAD_EDITORIAL_PLAYLIST_START,
  Dashboard.LOAD_EDITORIAL_PLAYLIST_SUCCESS,
  Dashboard.LOAD_EDITORIAL_PLAYLIST_ERROR
)<{id: number}, {id: number; tracklist: ReturnType<typeof mapDeezerTrackToInternal>[]}, { id: number;  error: string; }>();

export const loadEditorialPlaylist = (id: number) => async (dispatch) => {
  dispatch(loadEditorialPlaylistAction.request({id}));
  try {
    const tracklist = await rest.Deezer.getPlaylistTracks(id);
    dispatch(loadEditorialPlaylistAction.success({
      id,
      tracklist: tracklist.data.map(mapDeezerTrackToInternal)
    }));
  } catch (error) {
    dispatch(loadEditorialPlaylistAction.failure({ id, error: error.message }));
    logger.error(error);
  }
};
