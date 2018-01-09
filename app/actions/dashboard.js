import {
  getBestNewAlbums,
  getBestNewTracks
} from 'pitchfork-bnm';

export const LOAD_BEST_NEW_ALBUMS_START = 'LOAD_BEST_NEW_ALBUMS_START';
export const LOAD_BEST_NEW_ALBUMS_SUCCESS = 'LOAD_BEST_NEW_ALBUMS_SUCCESS';
export const LOAD_BEST_NEW_ALBUMS_ERROR = 'LOAD_BEST_NEW_ALBUMS_ERROR';

export const LOAD_BEST_NEW_TRACKS_START = 'LOAD_BEST_NEW_TRACKS_START';
export const LOAD_BEST_NEW_TRACKS_SUCCESS = 'LOAD_BEST_NEW_TRACKS_SUCCESS';
export const LOAD_BEST_NEW_TRACKS_ERROR = 'LOAD_BEST_NEW_TRACKS_ERROR';

export function loadBestNewAlbums() {
  getBestNewAlbums().
    then(albums => {
      console.log(albums);
    })
    .catch(error => {
      console.error(error);
    });
}

export function loadBestNewTracks() {
  getBestNewTracks().
    then(tracks => {
      console.log(tracks);
    })
    .catch(error => {
      console.error(error);
    });
}
