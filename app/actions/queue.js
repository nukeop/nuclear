const _ = require('lodash');
const uuidv4 = require('uuid/v4');

export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';
export const REMOVE_FROM_QUEUE = 'REMOVE_FROM_QUEUE';
export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const ADD_STREAMS_TO_QUEUE_ITEM = 'ADD_STREAMS_TO_QUEUE_ITEM';
export const REPLACE_STREAMS_IN_QUEUE_ITEM = 'REPLACE_STREAMS_IN_QUEUE_ITEM';
export const NEXT_SONG = 'NEXT_SONG';
export const PREVIOUS_SONG = 'PREVIOUS_SONG';
export const SELECT_SONG = 'SELECT_SONG';
export const SWAP_SONGS = 'SWAP_SONGS';

export function addToQueue(musicSources, item) {
  return dispatch => {
    item.loading = true;
    item.uuid = uuidv4();
    dispatch({
      type: ADD_TO_QUEUE,
<<<<<<< HEAD
      payload: track
    });

    Promise.all(
      _.map(musicSources, m => m.search(track.artist + ' ' + track.name))
    )
      .then(results => Promise.all(results))
      .then(results => {
        let item = track;
        let payloadItem = { streams: results };
        if (!loading) {
          payloadItem = { streams: results, loading: false };
        }
        dispatch({
          type: ADD_STREAMS_TO_QUEUE_ITEM,
          payload: Object.assign({}, track, payloadItem)
        });
=======
      payload: item
    });

    Promise.all(_.map(musicSources, m => m.search(item.artist + ' ' + item.name)))
    .then(results => Promise.all(results))
    .then(results => {
      dispatch({
        type: ADD_STREAMS_TO_QUEUE_ITEM,
        payload: Object.assign({}, item, {loading: false, streams: results})
>>>>>>> parent of ef3e635... Factorized addToQueue
      });
    });
  };
}

export function removeFromQueue(item) {
  return {
    type: REMOVE_FROM_QUEUE,
    payload: item
  };
}

export function addPlaylistTracksToQueue(musicSources, tracks) {
  return (dispatch) => {
    tracks.map((track, i) => {
      dispatch({
        type: ADD_TO_QUEUE,
        payload: track
      });


      Promise.all(_.map(musicSources, m => m.search(track.artist + ' ' + track.name)))
      .then(results => Promise.all(results))
      .then(results => {
        let item = track;
        dispatch({
          type: ADD_STREAMS_TO_QUEUE_ITEM,
          payload: Object.assign({}, item, {streams: results})
        });
      });
    });

  };
}

export function rerollTrack(musicSource, selectedStream, track) {
  return dispatch => {
    musicSource.getAlternateStream(track.artist + ' ' + track.name, selectedStream)
    .then(newStream => {
      let streams = _.map(track.streams, stream => {
        return stream.source === newStream.source ? newStream : stream;
      });

<<<<<<< HEAD
        dispatch({
          type: REPLACE_STREAMS_IN_QUEUE_ITEM,
          payload: Object.assign({}, track, { streams })
        });
=======
      dispatch({
        type: REPLACE_STREAMS_IN_QUEUE_ITEM,
        payload: Object.assign({}, track, {streams})
>>>>>>> parent of ef3e635... Factorized addToQueue
      });
    });
  };
}

export function clearQueue() {
  return {
    type: CLEAR_QUEUE,
    payload: null
  };
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

export function selectSong(index) {
  return {
    type: SELECT_SONG,
    payload: index
  };
}

export function swapSongs(itemFrom, itemTo) {
  return {
    type: SWAP_SONGS,
    payload: {
      itemFrom,
      itemTo
    }
  };
}
