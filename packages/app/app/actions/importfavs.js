import { LastFmApi } from '@nuclear/core';
import { store } from '../persistence/store';
import globals from '../globals';
const lastfm = new LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);
// first function is used to extract the total number of loved tracks by sending a request to the
// last.fm api for 1 song. (total number of loved tracks is included in  the response fields)
// that number is then used to fetch all the songs in the second function which also adds them to the favorites
export function ImportFmFavorites() {
  let storage = store.get('lastFm');
  if (storage){
    return lastfm.getNumberOfLovedTracks(storage.lastFmName, 1);
  }
}

export function fetchAllFmFavorites(totalTracks = 1) {
  let storage = store.get('lastFm');
  if (storage) {
    return lastfm.getNumberOfLovedTracks(storage.lastFmName, totalTracks);
  }
}
