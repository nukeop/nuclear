import { LastFmApi } from '@nuclear/core';
import { store } from '../persistence/store';
import globals from '../globals';
const lastfm = new LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);
// function is used to extract the total number of loved tracks by sending a request to the
// last.fm api. defaults to 1 which can be used to extract total number of loved tracks before issueing
// another request for all the loved tracks
export function fetchAllFmFavorites(totalTracks = 1) {
  let storage = store.get('lastFm');
  if (storage) {
    return lastfm.getNumberOfLovedTracks(storage.lastFmName, totalTracks);
  }
}
