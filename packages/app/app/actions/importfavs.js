import logger from 'electron-timber';
import { LastFmApi } from '@nuclear/core';
import { store } from '../persistence/store';
import globals from '../globals';
import * as FavoritesActions from './favorites';
const lastfm = new LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export const FAV_IMPORT_INIT = 'FAV_IMPORT_INIT';

export const LASTFM_FAV_IMPORT_START = 'LASTFM_FAV_IMPORT_START';
export const LASTFM_FAV_IMPORT_SUCCESS_1 = 'LASTFM_FAV_IMPORT_SUCCESS_1';
export const LASTFM_FAV_IMPORT_SUCCESS_FINAL = 'LASTFM_FAV_IMPORT_SUCCESS_FINAL';
export const LASTFM_FAV_IMPORT_ERROR = 'LASTFM_FAV_IMPORT_ERROR';

export function FavImportInit() {
  return dispatch => {
    dispatch({
      type: FAV_IMPORT_INIT,
      payload: {
        lastFmFavImportStatus: true,
        lastFmFavImportMessage: ''
      }
    });
  };
}

function FmFavError() {
  return {
    type: LASTFM_FAV_IMPORT_ERROR,
    payload: null
  };
}
function FmSuccess1(count) {
  return {
    type: LASTFM_FAV_IMPORT_SUCCESS_1,
    payload: {
      lastFmFavImportCount: count
    }
  };
}
function FmSuccessFinal(count) {
  return {
    type: LASTFM_FAV_IMPORT_SUCCESS_FINAL,
    payload: {
      lastFmFavImportTotal: count
    }
  };
}

export function fetchAllFmFavorites() {
  let storage = store.get('lastFm');
  if (storage) {
    return dispatch => {
      dispatch({
        type: LASTFM_FAV_IMPORT_START,
        payload: null
      });
      lastfm.getNumberOfLovedTracks(storage.lastFmName, 1)
        .then((resp) => resp.json())
        .then(req => {
          if (!req.lovedtracks) {
            dispatch(FmFavError());
            return;
          }
          let totalLovedTracks = req.lovedtracks['@attr'].total;
          dispatch(FmSuccess1(totalLovedTracks));
          lastfm.getNumberOfLovedTracks(storage.lastFmName, totalLovedTracks)
            .then((resp) => resp.json())
            .then((req) => {
              if (!req.lovedtracks) {
                dispatch(FmFavError());
                return;
              }
              let counter = 0;
              req.lovedtracks.track.forEach(favtrack => {
                FavoritesActions.addFavoriteTrack(favtrack);
                counter += 1;
              });
              dispatch(FmSuccessFinal(counter));
            })
            .catch((error) => {
              dispatch(FmFavError());
              logger.error(error);
            });
        })
        .catch((error) => {
          dispatch(FmFavError());
          logger.error(error);
        });
    };
  } else {
    return dispatch => {
      dispatch({
        type: LASTFM_FAV_IMPORT_ERROR,
        payload: null
      });
    }; 
  }
}
