import logger from 'electron-timber';
import { rest, store } from '@nuclear/core';

import globals from '../globals';
import * as FavoritesActions from './favorites';
import { ImportFavs } from './actionTypes';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export function FavImportInit() {
  return {
    type: ImportFavs.FAV_IMPORT_INIT,
    payload: {
      lastFmFavImportStatus: true,
      lastFmFavImportMessage: ''
    }
  };
}

const FmFavError = (msg = 'Failed to import favorites.') => ({
  type: ImportFavs.LASTFM_FAV_IMPORT_ERROR,
  payload: {
    lastFmFavImportErrorMsg: msg
  } });

function FmSuccess1(count) {
  return {
    type: ImportFavs.LASTFM_FAV_IMPORT_SUCCESS_1,
    payload: {
      lastFmFavImportCount: count
    }
  };
}
function FmSuccessFinal(count) {
  return {
    type: ImportFavs.LASTFM_FAV_IMPORT_SUCCESS_FINAL,
    payload: {
      lastFmFavImportTotal: count
    }
  };
}

export function fetchAllFmFavorites() {
  const storage = store.get('lastFm');
  if (storage) {
    return dispatch => {
      dispatch({ type: ImportFavs.LASTFM_FAV_IMPORT_START });
      lastfm.getNumberOfLovedTracks(storage.lastFmName, 1)
        .then((resp) => resp.json())
        .then(req => {
          if (!req.lovedtracks) {
            throw new Error;
          }
          const totalLovedTracks = req.lovedtracks['@attr'].total;
          if (totalLovedTracks <= 0 || totalLovedTracks > 1000) {
            throw totalLovedTracks;
          }
          dispatch(FmSuccess1(totalLovedTracks));
          return lastfm.getNumberOfLovedTracks(storage.lastFmName, totalLovedTracks);
        })
        .then((resp) => resp.json())
        .then((req) => {
          if (!req.lovedtracks || !req.lovedtracks.track) {
            throw new Error;
          }
          req.lovedtracks.track.forEach(favtrack => {
            FavoritesActions.addFavoriteTrack(favtrack);
          });
          dispatch(FmSuccessFinal(req.lovedtracks.track.length));
        })
        .catch((error) => {
          if (error <= 0 || error > 1000) {
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
