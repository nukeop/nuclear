const _ = require('lodash');

import { safeAddUuid } from './helpers';
import { startPlayback } from './player.js';
import * as mpris from '../mpris';

export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';
export const REMOVE_FROM_QUEUE = 'REMOVE_FROM_QUEUE';
export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const ADD_STREAMS_TO_QUEUE_ITEM = 'ADD_STREAMS_TO_QUEUE_ITEM';
export const REPLACE_STREAMS_IN_QUEUE_ITEM = 'REPLACE_STREAMS_IN_QUEUE_ITEM';
export const NEXT_SONG = 'NEXT_SONG';
export const PREVIOUS_SONG = 'PREVIOUS_SONG';
export const SELECT_SONG = 'SELECT_SONG';
export const REPOSITION_SONG = 'REPOSITION_SONG';

function addTrackToQueue (streamProviders, item) {
  return dispatch => {
    item.loading = true;
    item = safeAddUuid(item);
    mpris.addTrack(item);

    dispatch({
      type: ADD_TO_QUEUE,
      payload: item
    });
    Promise.all(_.map(streamProviders, m => m.search({ artist: item.artist, track: item.name })))
      .then(results => Promise.all(results))
      .then(results => {
        _.pull(results, null);
        dispatch({
          type: ADD_STREAMS_TO_QUEUE_ITEM,
          payload: Object.assign({}, item, { streams: results, loading: false })
        });
      });
  };
}

export function playTrack (streamProviders, item) {
  return dispatch => {
    dispatch(clearQueue());
    dispatch(addToQueue(streamProviders, item));
    dispatch(selectSong(0));
    dispatch(startPlayback());
  };
}

export function addToQueue (streamProviders, item) {
  return addTrackToQueue(streamProviders, item);
}

export function removeFromQueue (item) {
  mpris.removeTrack(item);
  return {
    type: REMOVE_FROM_QUEUE,
    payload: item
  };
}

export function addPlaylistTracksToQueue (streamProviders, tracks) {
  return dispatch => {
    tracks.map(item => {
      dispatch(addTrackToQueue(streamProviders, item));
    });
  };
}

export function rerollTrack (streamProvider, selectedStream, track) {
  return dispatch => {
    streamProvider.getAlternateStream({ artist: track.artist, track: track.name }, selectedStream).then(newStream => {
      let streams = _.map(track.streams, stream => {
        return stream.source === newStream.source ? newStream : stream;
      });
      dispatch({
        type: REPLACE_STREAMS_IN_QUEUE_ITEM,
        payload: Object.assign({}, track, { streams })
      });
    });
  };
}

export function clearQueue () {
  mpris.sendQueueItems([]);
  return {
    type: CLEAR_QUEUE,
    payload: null
  };
}

function nextSongAction() {
  return {
    type: NEXT_SONG,
    payload: null
  };
}

function previousSongAction() {
  return {
    type: PREVIOUS_SONG,
    payload: null
  };
}

export function selectSong (index) {
  return {
    type: SELECT_SONG,
    payload: index
  };
}

export function repositionSong (itemFrom, itemTo) {
  return {
    type: REPOSITION_SONG,
    payload: {
      itemFrom,
      itemTo
    }
  };
}

function dispatchWithShuffle(dispatch, getState, action) {
  const state = getState();
  const settings = state.settings;
  const queue = state.queue;

  if (settings.shuffleQueue) {
    const index = _.random(0, queue.queueItems.length - 1);
    dispatch(selectSong(index));
  } else {
    dispatch(action());
  }
}

export function previousSong() {
  return (dispatch, getState) => {
    const state = getState();
    const settings = state.settings;

    if (settings.shuffleWhenGoingBack) {
      dispatchWithShuffle(dispatch, getState, previousSongAction);
    } else {
      dispatch(previousSongAction());
    }
  };
}

export function nextSong() {
  return (dispatch, getState) => {
    dispatchWithShuffle(dispatch, getState, nextSongAction);
  };
}
