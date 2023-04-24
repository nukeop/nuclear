import logger from 'electron-timber';
import _, { isEmpty, isString } from 'lodash';
import { createStandardAction } from 'typesafe-actions';

import { rest, StreamProvider } from '@nuclear/core';
import { getTrackArtist } from '@nuclear/ui';
import { Track } from '@nuclear/ui/lib/types';

import { safeAddUuid } from './helpers';
import { pausePlayback, startPlayback } from './player';
import { QueueItem, TrackStream } from '../reducers/queue';
import { RootState } from '../reducers';
import { LocalLibraryState } from './local';
import { Queue } from './actionTypes';
import StreamProviderPlugin from '@nuclear/core/src/plugins/streamProvider';
import { isTopStream, TopStream } from '@nuclear/core/src/rest/Nuclear/StreamMappings';
import { queue as queueSelector } from '../selectors/queue';

type LocalTrack = Track & {
  local: true;
};

const isLocalTrack = (track: Track): track is LocalTrack => track.local;

const localTrackToQueueItem = (track: LocalTrack, local: LocalLibraryState): QueueItem => {
  const { streams, ...rest } = track;

  const matchingLocalTrack = local.tracks.find(localTrack => localTrack.uuid === track.uuid);

  const resolvedStream = !isEmpty(streams) 
    ? streams?.find(stream => stream.source === 'Local') 
    : {
      source: 'Local',
      stream: `file://${matchingLocalTrack.path}`,
      duration: matchingLocalTrack.duration
    } as TrackStream;

  return toQueueItem({
    ...rest,
    streams: [resolvedStream]
  });
};


export const toQueueItem = (track: Track): QueueItem => ({
  ...track,
  artist: isString(track.artist) ? track.artist : track.artist.name,
  name: track.title ? track.title : track.name,
  streams: track.streams ?? []
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

export const getTrackStreams = async (
  track: Track | LocalTrack,
  selectedStreamProvider: StreamProvider
) => {
  if (isLocalTrack(track)) {
    return track.streams.filter((stream) => stream.source === 'Local');
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

export const updateQueueItem = (item: QueueItem) => ({
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
      item = {
        ...safeAddUuid(item),
        streams: item.local ? item.streams : [],
        loading: false
      };

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
    };

export const selectNewStream = (index: number, streamId: string) => async (dispatch, getState) => {
  const track = queueSelector(getState()).queueItems[index];
  const selectedStreamProvider: StreamProviderPlugin = getSelectedStreamProvider(getState);

  const oldStreamData = track.streams.find(stream => stream.id === streamId);
  const streamData = await selectedStreamProvider.getStreamForId(streamId);

  if (!streamData) {
    dispatch(removeFromQueue(index));
  } else {
    dispatch(
      updateQueueItem({
        ...track,
        streams: [
          {
            ...oldStreamData,
            stream: streamData.stream,
            duration: streamData.duration
          },
          ...track.streams.filter(stream => stream.id !== streamId)
        ]
      })
    );
  }
};

export const findStreamsForTrack = (index: number) => async (dispatch, getState) => {
  const {queue, settings}: RootState = getState();

  const track = queue.queueItems[index];

  if (track && !track.local && isEmpty(track.streams)) {
    dispatch(updateQueueItem({
      ...track,
      loading: true
    }));
    const selectedStreamProvider = getSelectedStreamProvider(getState);
    try {
      let streamData = await getTrackStreams(
        track,
        selectedStreamProvider
      );

      if (settings.useStreamVerification) {
        try {
          const StreamMappingsService = new rest.NuclearStreamMappingsService(process.env.NUCLEAR_VERIFICATION_SERVICE_URL);
          const topStream = await StreamMappingsService.getTopStream(
            track.artist, 
            track.name,
            selectedStreamProvider.sourceName,
            settings?.userId
          );
            // Use the top stream ID and put it at the top of the list
          if (isTopStream(topStream.body)) {
            streamData = [
              streamData.find(stream => stream.id === (topStream.body as TopStream).stream_id),          
              ...streamData.filter(stream => stream.id !== (topStream.body as TopStream).stream_id)
            ];
          }
        } catch (e) {
          logger.error('Failed to get top stream', e);
        }
      }

      if (streamData === undefined) {
        dispatch(removeFromQueue(index));
      } else {
        streamData = [
          await selectedStreamProvider.getStreamForId(streamData[0].id),
          ...streamData.slice(1)
        ];

        dispatch(
          updateQueueItem({
            ...track,
            loading: false,
            error: false,
            streams: streamData
          })
        );
      }
    } catch (e) {
      logger.error(
        `An error has occurred when searching for streams with ${selectedStreamProvider.sourceName} for "${track.artist} - ${track.name}."`
      );
      logger.error(e);
      dispatch(
        updateQueueItem({
          ...track,
          loading: false,
          error: {
            message: `An error has occurred when searching for streams with ${selectedStreamProvider.sourceName}.`,
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

export const removeFromQueue = (index: number) => ({
  type: Queue.REMOVE_QUEUE_ITEM,
  payload: { index}
});

export function addPlaylistTracksToQueue(tracks) {
  return async (dispatch) => {
    await tracks.forEach(async (item) => {
      await dispatch(addToQueue(item));
    });
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
