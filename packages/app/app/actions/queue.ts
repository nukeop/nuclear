import logger from 'electron-timber';
import _, { isString } from 'lodash';
import { createStandardAction } from 'typesafe-actions';

import { StreamProvider } from '@nuclear/core';
import { getTrackArtist } from '@nuclear/ui';
import { Track } from '@nuclear/ui/lib/types';

import { safeAddUuid } from './helpers';
import { pausePlayback, startPlayback } from './player';
import { QueueItem, TrackStream } from '../reducers/queue';
import { RootState } from '../reducers';
import { LocalLibraryState } from './local';
import { Queue } from './actionTypes';

type LocalTrack = Track & {
  local: true;
  streams: TrackStream[];
};

const isLocalTrack = (track: Track): track is LocalTrack => track.local;

const localTrackToQueueItem = (track: LocalTrack, local: LocalLibraryState): QueueItem => {
  const { streams, stream, ...rest } = track;

  const matchingLocalTrack = local.tracks.find(localTrack => localTrack.uuid === track.uuid);

  const resolvedStream = stream ??
    streams?.find(stream => stream.source === 'Local') ??
    {
      source: 'Local',
      stream: `file://${matchingLocalTrack.path}`,
      duration: matchingLocalTrack.duration
    } as TrackStream;

  return toQueueItem({
    ...rest,
    stream: resolvedStream
  });
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

export const getTrackStream = async (
  track: Track | LocalTrack,
  selectedStreamProvider: StreamProvider
) => {
  if (isLocalTrack(track)) {
    return track.streams.find((stream) => stream.source === 'Local');
  } else {
    return selectedStreamProvider.search({
      artist: getTrackArtist(track),
      track: track.name
    });
  }
};

const addQueueItem = (item: QueueItem) => ({
  type: Queue.ADD_QUEUE_ITEM,
  payload: { item }
});

const updateQueueItem = (item: QueueItem) => ({
  type: Queue.UPDATE_QUEUE_ITEM,
  payload: { item }
});

const playNextItem = (item: QueueItem) => ({
  type: Queue.PLAY_NEXT_ITEM,
  payload: { item }
});

export const queueDrop = (paths) => ({
  type: Queue.QUEUE_DROP,
  payload: paths
});

export const streamFailed = () => ({
  type: Queue.STREAM_FAILED
});

export function repositionSong(itemFrom, itemTo) {
  return {
    type: Queue.REPOSITION_TRACK,
    payload: {
      itemFrom,
      itemTo
    }
  };
}

export const clearQueue = createStandardAction(Queue.CLEAR_QUEUE)();
export const nextSongAction = createStandardAction(Queue.NEXT_TRACK)();
export const previousSongAction = createStandardAction(Queue.PREVIOUS_TRACK)();
export const selectSong = createStandardAction(Queue.SELECT_TRACK)<number>();
export const playNext = (item: QueueItem) => addToQueue(item, true);

export const addToQueue =
  (item: QueueItem, asNextItem = false) =>
    async (dispatch, getState) => {
      const { local }: RootState = getState();
      item = safeAddUuid(item);
      item.loading = !item.local;

      const {
        connectivity
      } = getState();
      const isAbleToAdd = (!connectivity && item.local) || connectivity;

      if (isAbleToAdd && item.local) {
        dispatch(!asNextItem ? addQueueItem(localTrackToQueueItem(item as LocalTrack, local)) : playNextItem(localTrackToQueueItem(item as LocalTrack, local)));
      } else {
        isAbleToAdd &&
          dispatch(!asNextItem ? addQueueItem(item) : playNextItem(item));
      }

      if (!item.local && isAbleToAdd) {
        const selectedStreamProvider = getSelectedStreamProvider(getState);
        try {
          const streamData = await getTrackStream(
            item,
            selectedStreamProvider
          );

          if (streamData === undefined) {
            dispatch(removeFromQueue(item));
          } else {
            dispatch(
              updateQueueItem({
                ...item,
                loading: false,
                error: false,
                stream: streamData
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
    dispatch(startPlayback(false));
  };
}

export const removeFromQueue = (item: QueueItem) => ({
  type: Queue.REMOVE_QUEUE_ITEM,
  payload: item
});

export function addPlaylistTracksToQueue(tracks) {
  return async (dispatch) => {
    await tracks.forEach(async (item) => {
      await dispatch(addToQueue(item));
    });
  };
}

export function rerollTrack(track: QueueItem) {
  return async (dispatch, getState) => {
    const { plugin }: RootState = getState();
    const selectedStreamProvider = _.find(plugin.plugins.streamProviders, { sourceName: plugin.selected.streamProviders });

    dispatch(updateQueueItem({
      ...track,
      loading: true,
      error: false
    }));

    const newStream = await selectedStreamProvider
      .getAlternateStream(
        { artist: isString(track.artist) ? track.artist : track.artist.name, track: track.name },
        track.stream
      );

    dispatch(
      updateQueueItem({
        ...track,
        loading: false,
        error: false,
        stream: newStream
      })
    );
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
    dispatch(pausePlayback(false));
    setImmediate(() => dispatch(startPlayback(false)));
  };
}


export const changeTrackStream = createStandardAction(Queue.CHANGE_TRACK_STREAM)<{
  item: QueueItem;
  stream: TrackStream;
}>();

export const switchStreamProvider = ({
  item,
  streamProviderName
}: {
  item: QueueItem;
  streamProviderName: string;
}) => {
  return async (dispatch, getState) => {
    const {
      plugin: {
        plugins: { streamProviders }
      }
    }: RootState = getState();

    dispatch(updateQueueItem({
      ...item,
      loading: true,
      error: false
    }));

    const streamProvider = streamProviders.find(provider => provider.sourceName === streamProviderName);

    if (item && streamProvider) {
      const streamData = await getTrackStream(
        item,
        streamProvider
      );

      if (streamData !== undefined) {
        dispatch(
          changeTrackStream({
            item,
            stream: streamData
          })
        );
      }
    }
  };
};
