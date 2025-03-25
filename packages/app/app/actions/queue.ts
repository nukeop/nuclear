import { logger } from '@nuclear/core';
import { isEmpty, isString, find } from 'lodash';
import { createStandardAction } from 'typesafe-actions';
import { v4 } from 'uuid';

import { rest, StreamProvider } from '@nuclear/core';
import { getTrackArtist, getTrackTitle } from '@nuclear/ui';
import { Track } from '@nuclear/ui/lib/types';

import { safeAddUuid } from './helpers';
import { pausePlayback, startPlayback } from './player';
import { QueueItem, TrackStream } from '../reducers/queue';
import { RootState } from '../reducers';
import { LocalLibraryState } from './local';
import { Queue } from './actionTypes';
import StreamProviderPlugin from '@nuclear/core/src/plugins/streamProvider';
import { isSuccessCacheEntry } from '@nuclear/core/src/rest/Nuclear/StreamMappings';
import { queue as queueSelector } from '../selectors/queue';
import { error } from './toasts';
import { random } from 'lodash';
import { Dispatch } from 'redux';

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
    uuid: v4(),
    streams: [resolvedStream]
  });
};


export const toQueueItem = (track: Track): QueueItem => {
  const queueItem: QueueItem = {
    ...track,
    artist: isString(track.artist) ? track.artist : track.artist.name,
    name: track.title ? track.title : track.name,
    streams: track.streams ?? []
  };

  safeAddUuid(queueItem);

  if (!queueItem.queueId) {
    queueItem.queueId = v4();
  }

  return queueItem;
};

// Exported to facilitate testing.
export const getSelectedStreamProvider = (getState: () => RootState): StreamProviderPlugin => {
  const {
    plugin: {
      plugins: { streamProviders },
      selected
    }
  } = getState();

  return find(streamProviders, { sourceName: selected.streamProviders });
};

// Exported to facilitate testing.
export const resolveTrackStreams = async (
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

export const queueDrop = (paths: string[]) => ({
  type: Queue.QUEUE_DROP,
  payload: paths
});

export const repositionSong = (itemFrom: number, itemTo: number) => ({
  type: Queue.REPOSITION_TRACK,
  payload: {
    itemFrom,
    itemTo
  }
});

export const clearQueue = createStandardAction(Queue.CLEAR_QUEUE)();
export const nextSongAction = createStandardAction(Queue.NEXT_TRACK)();
export const previousSongAction = createStandardAction(Queue.PREVIOUS_TRACK)();
export const selectSong = createStandardAction(Queue.SELECT_TRACK)<number>();
export const playNext = (item: QueueItem) => addToQueue(item, true);

export const addToQueue =
  (item: QueueItem, asNextItem = false) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
      const { local }: RootState = getState();
      item = {
        ...safeAddUuid(item),
        queueId: v4(),
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

export const reloadTrack = (index: number) => async (dispatch: Dispatch, getState: () => RootState) => {
  const track = queueSelector(getState()).queueItems[index];
  dispatch(
    updateQueueItem({
      ...track,
      error: false,
      streams: []
    })
  );
};

export const selectNewStream = (index: number, streamId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
  const getLatestTrack = () => queueSelector(getState()).queueItems[index];
  let track = getLatestTrack();
  const selectedStreamProvider: StreamProviderPlugin = getSelectedStreamProvider(getState);

  const oldStreamData = track.streams.find(stream => stream.id === streamId);
  const streamData = await selectedStreamProvider.getStreamForId(streamId);

  if (!streamData) {
    logger.error(`No stream data found for ${track.artist} - ${track.name}, streamId: ${streamId}`);
    dispatch(removeFromQueue(index));
  } else {
    track = getLatestTrack();
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

const verifyStreamWithService = async (
  track: QueueItem,
  streamData: TrackStream[],
  selectedStreamProvider: StreamProvider,
  settings: RootState['settings']
): Promise<TrackStream[]> => {
  if (!settings.useStreamVerification) {
    return streamData;
  }

  try {
    const StreamMappingsService = rest.NuclearStreamMappingsService.get(process.env.NUCLEAR_VERIFICATION_SERVICE_URL);
    const topStream = await StreamMappingsService.getTopStream(
      getTrackArtist(track),
      getTrackTitle(track),
      selectedStreamProvider.sourceName,
      settings?.userId
    );

    if (!isSuccessCacheEntry(topStream)) {
      return streamData;
    }

    const verifiedStream = streamData.find(stream => stream.id === topStream.value.stream_id);
    const otherStreams = streamData.filter(stream => stream.id !== topStream.value.stream_id);
    return verifiedStream ? [verifiedStream, ...otherStreams] : streamData;
  } catch (e) {
    logger.error('Failed to get top stream', e);
    return streamData;
  }
};

const resolveStreams = async (
  track: QueueItem,
  selectedStreamProvider: StreamProvider
): Promise<TrackStream[]> => {
  const streamData = await getTrackStreams(track, selectedStreamProvider);
  
  return resolveSourceUrlForTheFirstStream(streamData, selectedStreamProvider);
};

export const findStreamsForTrack = (index: number, streamLookupErrorMessage: string) => async (dispatch, getState) => {
  const getLatestTrack = () => queueSelector(getState()).queueItems[index];
  let track = getLatestTrack();

  if (!track || track.local || !trackHasNoFirstStream(track)) {
    return;
  }

  if (!track.loading) {
    dispatch(updateQueueItem({ ...track, loading: true }));
  }

  const selectedStreamProvider = getSelectedStreamProvider(getState);

  try {
    let streamData = await resolveStreams(track, selectedStreamProvider);
    
    if (streamData.length === 0) {
      dispatch(removeFromQueue(index));
      return;
    }

    const settings = getState().settings;
    streamData = await verifyStreamWithService(track, streamData, selectedStreamProvider, settings);

    const firstStream = streamData[0];
    if (!firstStream?.stream) {
      track = getLatestTrack();
      removeFirstStream(track, index)(dispatch);
      return;
    }

    track = getLatestTrack();
    dispatch(updateQueueItem({
      ...track,
      loading: false,
      error: false,
      streams: streamData
    }));
  } catch (e) {
    logger.error(
      `An error has occurred when searching for streams with ${selectedStreamProvider.sourceName} for "${track.artist} - ${track.name}".`
    );
    logger.error(e);
    
    track = getLatestTrack();
    removeFirstStream(track, index)(dispatch);
  }
};

const getTrackStreams = async (track: QueueItem, streamProvider: StreamProvider): Promise<TrackStream[]> => {
  if (isEmpty(track.streams)) {
    return resolveTrackStreams(
      track,
      streamProvider
    );
  }
  return track.streams;
};

const resolveSourceUrlForTheFirstStream = async (trackStreams: TrackStream[], streamProvider: StreamProvider): Promise<TrackStream[]> => {
  if (isEmpty(trackStreams)) {
    return [];
  }

  const firstStream = trackStreams.find(Boolean);
  if (isEmpty(firstStream.stream)) {
    try {
      const resolvedStream = await streamProvider.getStreamForId(firstStream.id);
      return [
        resolvedStream,
        ...trackStreams.filter(stream => stream.id !== firstStream.id)
      ];
    } catch (e) {
      logger.error(`Error resolving stream URL for ${firstStream.id}`, e);
      return resolveSourceUrlForTheFirstStream(
        trackStreams.filter(stream => stream.id !== firstStream.id),
        streamProvider
      );
    }

  }
  // The stream URL might already be resolved, for example for a previously played track.
  return trackStreams;
};

export const trackHasNoFirstStream = (track: QueueItem): boolean => {
  return isEmpty(track?.streams) || isEmpty(track.streams[0].stream);
};

export const removeFirstStream = (track: QueueItem, trackIndex: number) => (dispatch) => {
  const remainingStreams = track.streams.slice(1);
  
  if (remainingStreams.length === 0) {
    // no more streams are available
    dispatch(removeFromQueue(trackIndex));
    dispatch(error(`${track.artist} - ${track.name} was removed from the queue`, 'No streams available'));
  } else {
    // remove the first (unavailable) stream
    dispatch(updateQueueItem({
      ...track,
      loading: false,
      error: false,
      streams: remainingStreams
    }));
  }
};

export const playTrack = (streamProviders: StreamProvider[], item: QueueItem) => (dispatch) => {
  dispatch(clearQueue());
  dispatch(addToQueue(item));
  dispatch(selectSong(0));
  dispatch(startPlayback(false));
};

export const removeFromQueue = (index: number) => ({
  type: Queue.REMOVE_QUEUE_ITEM,
  payload: { index}
});

export const addPlaylistTracksToQueue = (tracks: Track[]) => async (dispatch) => {
  await tracks.forEach(async (item) => {
    await dispatch(addToQueue(toQueueItem(item)));
  });
};

function dispatchWithShuffle(
  dispatch: Dispatch, 
  getState: () => RootState, 
  action: () => { type: string; payload?: unknown }
) {
  const state = getState();
  const settings = state.settings;
  const queue = state.queue;

  if (settings.shuffleQueue) {
    const index = random(0, queue.queueItems.length - 1);
    dispatch(selectSong(index));
  } else {
    dispatch(action());
  }
}

export const previousSong = () => (dispatch, getState) => {
  const state = getState();
  const settings = state.settings;

  if (settings.shuffleWhenGoingBack) {
    dispatchWithShuffle(dispatch, getState, previousSongAction);
  } else {
    dispatch(previousSongAction());
  }
};

export const nextSong = () => (dispatch, getState) => {
  dispatchWithShuffle(dispatch, getState, nextSongAction);
  dispatch(pausePlayback(false));
  setImmediate(() => dispatch(startPlayback(false)));
};
