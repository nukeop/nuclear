import logger from 'electron-timber';
import { rest, store } from '@nuclear/core';

import globals from '../globals';
import * as FavoritesActions from './favorites';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export const FAV_IMPORT_INIT = 'FAV_IMPORT_INIT';

export const LASTFM_FAV_IMPORT_START = 'LASTFM_FAV_IMPORT_START';
export const LASTFM_FAV_IMPORT_SUCCESS_1 = 'LASTFM_FAV_IMPORT_SUCCESS_1';
export const LASTFM_FAV_IMPORT_SUCCESS_FINAL = 'LASTFM_FAV_IMPORT_SUCCESS_FINAL';
export const LASTFM_FAV_IMPORT_ERROR = 'LASTFM_FAV_IMPORT_ERROR';

export function FavImportInit() {
  return {
    type: FAV_IMPORT_INIT,
    payload: {
      lastFmFavImportStatus: true,
      lastFmFavImportMessage: ''
    }
  };
}

const FmFavError = (msg = 'Failed to import favorites.') => ({
  type: LASTFM_FAV_IMPORT_ERROR,
  payload: {
    lastFmFavImportErrorMsg: msg
  } });

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
  const storage = store.get('lastFm');
  if (storage) {
    return dispatch => {
      dispatch({ type: LASTFM_FAV_IMPORT_START });
      lastfm.getNumberOfLovedTracks(storage.lastFmName)
        .then((resp) => resp.json())
        .then((req) => {
          if (!req.lovedtracks) {
            throw new Error;
          }
          const totalLovedTracks = req.lovedtracks['@attr'].total;
          if (totalLovedTracks <= 0) {
            throw totalLovedTracks;
          }
          dispatch(FmSuccess1(totalLovedTracks));
          return fetchPaginatedFmFavorites(storage.lastFmName, totalLovedTracks);
        })
        .then((lovedTracks) => {
          lovedTracks.forEach(favtrack => {
            FavoritesActions.addFavoriteTrack(favtrack);
          });
          dispatch(FmSuccessFinal(lovedTracks.length));
        })
        .catch((error) => {
          if (error <= 0) {
            dispatch(FmFavError(' Invalid number of favorites [' + error + ']'));
          } else {
            dispatch(FmFavError());
            logger.error(error);
          }
        });
    };
  } else {
    return FmFavError();
  }
}

function fetchPaginatedFmFavorites(lastFmName, totalLovedTracks, page = 1, prevLovedTracks = []) {
  const numTracksToFetch = totalLovedTracks - ((page - 1) * 1000);
  return lastfm.getNumberOfLovedTracks(lastFmName, Math.min(1000, numTracksToFetch), page)
    .then((resp) => resp.json())
    .then((req) => {
      if (!req.lovedtracks || !req.lovedtracks.track) {
        throw new Error;
      }
      const lovedTracks = [...prevLovedTracks, ...req.lovedtracks.track];
      page++;
      if ((page - 1) * 1000 <= totalLovedTracks) {
        return fetchPaginatedFmFavorites(lastFmName, totalLovedTracks, page, lovedTracks);
      }
      return lovedTracks;
    });
}
