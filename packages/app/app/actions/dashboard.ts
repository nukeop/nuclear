import logger from 'electron-timber';
import { getBestNewAlbums, getBestNewTracks } from 'pitchfork-bnm';
import { createAsyncAction } from 'typesafe-actions';

import { rest } from '@nuclear/core';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';
import { DeezerEditorialCharts, mapDeezerTrackToInternal } from '@nuclear/core/src/rest/Deezer';

import globals from '../globals';
import { Dashboard } from './actionTypes';
import { PromotedArtist } from '@nuclear/core/src/rest/Nuclear/Promotion';

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

export const loadPromotedArtistsAction = createAsyncAction(
  Dashboard.LOAD_PROMOTED_ARTISTS_START,
  Dashboard.LOAD_PROMOTED_ARTISTS_SUCCESS,
  Dashboard.LOAD_PROMOTED_ARTISTS_ERROR
)<undefined, PromotedArtist[], string>();

export const loadPromotedArtists = () => async (dispatch) => {
  dispatch(loadPromotedArtistsAction.request());
  try {
    const service = new rest.NuclearPromotionService(
      process.env.NUCLEAR_SERVICES_URL,
      process.env.NUCLEAR_SERVICES_ANON_KEY
    );
    const artists = await service.getPromotedArtists();
    dispatch(loadPromotedArtistsAction.success(artists?.data));
  } catch (error) {
    dispatch(loadPromotedArtistsAction.failure(error.message));
    logger.error(error);
  }
};
