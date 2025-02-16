import { logger } from '@nuclear/core';
import { rest, store } from '@nuclear/core';

import globals from '../globals';
import * as FavoritesActions from './favorites';
import { ImportFavs } from './actionTypes';
import { ScrobblingState } from '../reducers/scrobbling';

const MAX_TRACKS_PER_PAGE = 1000;
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
  const storage = store.get('lastFm') as ScrobblingState;
  if (storage) {
    return async dispatch => {
      dispatch({ type: ImportFavs.LASTFM_FAV_IMPORT_START });
      try {
        const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);
        const numberOfTracksResponse = await(await lastfm.getLovedTracks(storage.lastFmName, 1)).json();
      
        if (!numberOfTracksResponse.lovedtracks) {
          throw new Error;
        }
        const totalLovedTracks = Number.parseInt(numberOfTracksResponse.lovedtracks['@attr'].total);
        const totalPages = Math.ceil(totalLovedTracks / MAX_TRACKS_PER_PAGE);
        dispatch(FmSuccess1(totalLovedTracks));
        let lovedTracks = [];
        for (let i = 1; i <= totalPages; i++) {
          const lovedTracksResponse = await(await lastfm.getLovedTracks(storage.lastFmName, Math.min(MAX_TRACKS_PER_PAGE, totalLovedTracks), i)).json();
          if (!lovedTracksResponse.lovedtracks) {
            throw new Error;
          }
          lovedTracks = [...lovedTracks, ...lovedTracksResponse.lovedtracks.track];
        }

        dispatch(FavoritesActions.bulkAddFavoriteTracks(lovedTracks));

        dispatch(FmSuccessFinal(lovedTracks.length));
      } catch (error) {
        dispatch(FmFavError(error.message));
        logger.error(error);
      }
    };
  }
}
