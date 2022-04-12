import logger from 'electron-timber';
import _, { isString } from 'lodash';

import { StreamProvider } from '@nuclear/core';
import { Track, TrackStream } from '@nuclear/ui/lib/types';

import { safeAddUuid } from './helpers';
import { pausePlayback, startPlayback } from './player.js';

export const QUEUE_DROP = 'QUEUE_DROP';
export const ADD_QUEUE_ITEM = 'ADD_QUEUE_ITEM';
export const PLAY_NEXT_ITEM = 'PLAY_NEXT_ITEM';
export const REMOVE_QUEUE_ITEM = 'REMOVE_QUEUE_ITEM';
export const UPDATE_QUEUE_ITEM = 'UPDATE_QUEUE_ITEM';
export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const NEXT_SONG = 'NEXT_SONG';
export const PREVIOUS_SONG = 'PREVIOUS_SONG';
export const SELECT_SONG = 'SELECT_SONG';
export const REPOSITION_SONG = 'REPOSITION_SONG';
export const STREAM_FAILED = 'STREAM_FAILED';
export const CHANGE_TRACK_STREAM = 'CHANGE_TRACK_STREAM';

export type QueueItem = {
  loading?: boolean;
  error?:
    | boolean
    | {
        message: string;
        details: string;
      };
  local?: boolean;
  artist: string;
  name: string;
  thumbnail?: string;
  streams?: TrackStream[];
};

export const toQueueItem = (track: Track): QueueItem => ({
  ...track,
  artist: isString(track.artist) ? track.artist : track.artist.name,
  name: track.title ? track.title : track.name
});

const getSelectedStreamProvider = (getState) => {
  const {
    plugin: {
      plugins: { streamProviders },
      selected
    }
  } = getState();

  return _.find(streamProviders, { sourceName: selected.streamProviders });
};

const getTrackStream = async (
  track: Track,
  selectedStreamProvider: StreamProvider,
  streamProviders: StreamProvider[]
) => {
  let streamData;
  if (track?.streams && track.streams.length) {
    const matchSelectedProvider = track.streams.find(
      (s) => s.source === selectedStreamProvider.sourceName
    );

    if (matchSelectedProvider && matchSelectedProvider.id) {
      streamData = await selectedStreamProvider.getStreamForId(
        matchSelectedProvider.id
      );
    } else {
      const firstKnownProvider = streamProviders.find(
        (s) => s.sourceName === track.streams[0].source
      );
      streamData = await firstKnownProvider.getStreamForId(track.streams[0].id);
    }
  }

  if (!streamData) {
    streamData = await selectedStreamProvider.search({
      artist:
        typeof track.artist === 'string' ? track.artist : track.artist.name,
      track: track.name
    });
  }

  return streamData;
};

const addQueueItem = (item: QueueItem) => ({
  type: ADD_QUEUE_ITEM,
  payload: { item }
});

const updateQueueItem = (item: QueueItem) => ({
  type: UPDATE_QUEUE_ITEM,
  payload: { item }
});

const playNextItem = (item: QueueItem) => ({
  type: PLAY_NEXT_ITEM,
  payload: { item }
});

export const addToQueue =
  (item: QueueItem, asNextItem = false) =>
    async (dispatch, getState) => {
      item = safeAddUuid(item);
      item.loading = !item.local;

      const {
        connectivity,
        plugin: {
          plugins: { streamProviders }
        }
      } = getState();
      const isAbleToAdd = (!connectivity && item.local) || connectivity;

      isAbleToAdd &&
      dispatch(!asNextItem ? addQueueItem(item) : playNextItem(item));

      if (!item.local && isAbleToAdd) {
        const selectedStreamProvider = getSelectedStreamProvider(getState);
        try {
          const streamData = await getTrackStream(
            {
              artist: item.artist,
              name: item.name,
              streams: item.streams
            },
            selectedStreamProvider,
            streamProviders
          );

          if (streamData === undefined) {
            dispatch(removeFromQueue(item));
          } else {
            dispatch(
              updateQueueItem({
                ...item,
                loading: false,
                error: false,
                streams: [streamData]
              })
            );
          }
        } catch (e) {
          logger.error(
            `An error has occurred when searching for a stream with ${selectedStreamProvider.sourceName} for "${item.artist} - ${item.name}."`
          );
          logger.error(e);
          dispatch(
            updateQueueItem({
              ...item,
              loading: false,
              error: {
                message: `An error has occurred when searching for a stream with ${selectedStreamProvider.sourceName}.`,
                details: e.message
              }
            })
          );
        }
      }
    };

export function playTrack(streamProviders, item: QueueItem) {
  return (dispatch) => {
    dispatch(clearQueue());
    dispatch(addToQueue(item));
    dispatch(selectSong(0));
    dispatch(startPlayback());
  };
}

export const removeFromQueue = (item: QueueItem) => ({
  type: REMOVE_QUEUE_ITEM,
  payload: item
});

export function addPlaylistTracksToQueue(tracks) {
  return async (dispatch) => {
    await tracks.forEach(async (item) => {
      await dispatch(addToQueue(item));
    });
  };
}

export function rerollTrack(streamProvider, selectedStream, track) {
  return (dispatch) => {
    dispatch(updateQueueItem({ ...track, loading: true, error: false }));

    streamProvider
      .getAlternateStream(
        { artist: track.artist, track: track.name },
        selectedStream
      )
      .then((newStream) => {
        const streams = _.map(track.streams, (stream) => {
          return stream.source === newStream.source ? newStream : stream;
        });

        dispatch(
          updateQueueItem({
            ...track,
            loading: false,
            error: false,
            streams
          })
        );
      });
  };
}

export function clearQueue() {
  return {
    type: CLEAR_QUEUE,
    payload: null
  };
}

export function nextSongAction() {
  return {
    type: NEXT_SONG,
    payload: null
  };
}

export function previousSongAction() {
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
    dispatch(pausePlayback());
    setImmediate(() => dispatch(startPlayback()));
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

export const queueDrop = (paths) => ({
  type: QUEUE_DROP,
  payload: paths
});

export const playNext = (item: QueueItem) => addToQueue(item, true);
