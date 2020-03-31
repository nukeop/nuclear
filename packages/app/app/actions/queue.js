import logger from 'electron-timber';
import _ from 'lodash';

import { safeAddUuid } from './helpers';
import { startPlayback } from './player.js';
import { mpris } from '@nuclear/core';

export const ADD_QUEUE_ITEM = 'ADD_QUEUE_ITEM';
export const REMOVE_QUEUE_ITEM = 'REMOVE_QUEUE_ITEM';
export const UPDATE_QUEUE_ITEM = 'UPDATE_QUEUE_ITEM';
export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const ADD_STREAMS_TO_QUEUE_ITEM = 'ADD_STREAMS_TO_QUEUE_ITEM';
export const NEXT_SONG = 'NEXT_SONG';
export const PREVIOUS_SONG = 'PREVIOUS_SONG';
export const SELECT_SONG = 'SELECT_SONG';
export const REPOSITION_SONG = 'REPOSITION_SONG';
export const STREAM_FAILED = 'STREAM_FAILED';
export const CHANGE_TRACK_STREAM = 'CHANGE_TRACK_STREAM';

const getSelectedStreamProvider = getState => {
  const {
    plugin: {
      plugins: { streamProviders }, selected
    }
  } = getState();

  return _.find(streamProviders, { sourceName: selected.streamProviders });
};

const addQueueItem = item => ({
  type: ADD_QUEUE_ITEM,
  payload: { item }
});

const updateQueueItem = item => ({
  type: UPDATE_QUEUE_ITEM,
  payload: { item }
});

function addTrackToQueue(streamProviders, item) {
  return async (dispatch, getState) => {
    item.loading = !item.local;
    item = safeAddUuid(item);
    mpris.addTrack(item);

    const { connectivity } = getState();
    const isAbleToAdd = (!connectivity && item.local) || connectivity;

    isAbleToAdd && dispatch(addQueueItem(item));

    if (!item.local && isAbleToAdd) {
      const selectedStreamProvider = getSelectedStreamProvider(getState);
      selectedStreamProvider.search({
        artist: item.artist,
        track: item.name
      })
        .then(streamData => {
          dispatch(updateQueueItem({
            ...item,
            loading: false,
            error: false,
            streams: [
              ..._.map(item.streams),
              streamData
            ]
          }));
        })
        .catch(e => {
          logger.error(`An error has occurred when searching for a stream with ${selectedStreamProvider.sourceName} for "${item.artist} - ${item.name}."`);
          logger.error(e);
          dispatch(updateQueueItem({
            ...item,
            loading: false,
            error: {
              message: `An error has occurred when searching for a stream with ${selectedStreamProvider.sourceName}.`,
              details: e.message
            }
          }));
        });
    }
  };
}

export function playTrack(streamProviders, item) {
  mpris.clearTrackList();
  return dispatch => {
    dispatch(clearQueue());
    dispatch(addToQueue(streamProviders, item));
    dispatch(selectSong(0));
    dispatch(startPlayback());
  };
}

export function addToQueue(streamProviders, item) {
  return addTrackToQueue(streamProviders, item);
}

export function removeFromQueue(item) {
  mpris.removeTrack(item);
  return {
    type: REMOVE_QUEUE_ITEM,
    payload: item
  };
}

export function addPlaylistTracksToQueue(streamProviders, tracks) {
  return dispatch => {
    tracks.map(item => {
      dispatch(addTrackToQueue(streamProviders, item));
    });
  };
}

export function rerollTrack(streamProvider, selectedStream, track) {
  return dispatch => {
    dispatch(updateQueueItem({ ...track, loading: true, error: false }));

    streamProvider.getAlternateStream({ artist: track.artist, track: track.name }, selectedStream)
      .then(newStream => {
        let streams = _.map(track.streams, stream => {
          return stream.source === newStream.source ? newStream : stream;
        });

        dispatch(updateQueueItem({ 
          ...track, 
          loading: false,
          error: false,
          streams
        }));
      });
  };
}

export function clearQueue() {
  mpris.clearTrackList();
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

export function selectSong(index) {
  return {
    type: SELECT_SONG,
    payload: index
  };
}

export function repositionSong(itemFrom, itemTo) {
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

export const streamFailed = () => ({
  type: STREAM_FAILED
});

export function changeTrackStream(track, stream) {
  return {
    type: CHANGE_TRACK_STREAM,
    payload: {
      track,
      stream
    }
  };
}
