import _ from 'lodash';
export const ADD_TO_DOWNLOADS = 'ADD_TO_DOWNLOADS';

function addTrackToDownloads(track) {
  return {
    type: ADD_TO_DOWNLOADS,
    payload: { item: {
      status: 'Started',
      completion: 0,
      track
    } }
  };
}

export function addToDownloads(musicSources, track) {
  return dispatch => {
    Promise.all(_.map(musicSources, m => m.search({ artist: track.artist, track: track.name })))
      .then(results => Promise.all(results))
      .then(streams => {
        dispatch(
          addTrackToDownloads(
            Object.assign(
              {},
              track,
              { streams }
            )
          )
        );
      });
  };
}
