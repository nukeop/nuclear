var _ = require('lodash');
export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';
export const ADD_STREAMS_TO_QUEUE_ITEM = 'ADD_STREAMS_TO_QUEUE_ITEM';
export const NEXT_SONG = 'NEXT_SONG';
export const PREVIOUS_SONG = 'PREVIOUS_SONG';

export function addToQueue(musicSources, item) {
  return (dispatch) => {
    item.loading = true;
    dispatch({
      type: ADD_TO_QUEUE,
      payload: item
    });

    Promise.all(_.map(musicSources, m => m.search(item.artist + ' ' + item.name)))
    .then(results => Promise.all(results))
    .then(results => {
       dispatch({
         type: ADD_STREAMS_TO_QUEUE_ITEM,
         payload: Object.assign({}, item, {loading: false, streams: results})
       });
    });
  }
}

export function nextSong() {
  return {
    type: NEXT_SONG,
    payload: null
  };
}

export function previousSong() {
  return {
    type: PREVIOUS_SONG,
    payload: null
  };
}
