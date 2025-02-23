import { Segment } from '@nuclear/core/src/rest/SponsorBlock.types';
import _ from 'lodash';

import { Queue } from '../actions/actionTypes';
import { SELECT_STREAM_PROVIDER } from '../actions/plugins';
import { removeFromQueue } from '../actions/queue';
import { logger } from '@nuclear/core';

export type TrackStream = {
  id: string;
  source: string;
  duration?: number;
  title?: string;
  thumbnail?: string;
  stream?: string;
  skipSegments?: Segment[];
};

export type QueueItem = {
  uuid?: string;
  loading?: boolean;
  error?:
    | boolean
    | {
        message: string;
        details: string;
      };
  streamLookupRetries?: number;
  local?: boolean;
  artist: string | { name: string };
  name: string;
  thumbnail?: string;
  streams?: TrackStream[];
};

export class QueueStore {
  queueItems: QueueItem[] = [];
  currentSong = 0;
}

const defaultState = {...new QueueStore()};

function reduceRemoveFromQueue(state, action: ReturnType<typeof removeFromQueue>) {
  const removeIx = action.payload.index;
  let newCurrent = state.currentSong;
  const newQueue = [...state.queueItems.slice(0, removeIx), ...state.queueItems.slice(removeIx + 1)];
  if (removeIx < state.currentSong) {
    newCurrent--;
  }
  return {
    ...state,
    queueItems: newQueue,
    currentSong: newCurrent
  };
}

function reduceSelectSong(state, action) {
  return Object.assign({}, state, {
    currentSong: action.payload
  });
}

function reduceRepositionSong(state, action) {
  const newQueue = _.cloneDeep(state.queueItems);
  const [removed] = newQueue.splice(action.payload.itemFrom, 1);
  newQueue.splice(action.payload.itemTo, 0, removed);

  let newCurrentSong = state.currentSong;
  if (action.payload.itemFrom === state.currentSong) {
    newCurrentSong = action.payload.itemTo;
  } else if (action.payload.itemFrom < action.payload.itemTo) {
    // moving top to bottom and
    // current song is in between
    if (state.currentSong > action.payload.itemFrom && state.currentSong <= action.payload.itemTo) {
      newCurrentSong--;
    }
  } else if (action.payload.itemFrom > action.payload.itemTo) {
    // moving bottom to top
    // current song is in between
    if (state.currentSong < action.payload.itemFrom && state.currentSong >= action.payload.itemTo) {
      newCurrentSong++;
    }
  }
  // otherwise does not change

  return Object.assign({}, state, {
    currentSong: newCurrentSong,
    queueItems: newQueue
  });
}

function reduceNextSong(state) {
  return Object.assign({}, state, {
    currentSong: (state.currentSong + 1) % state.queueItems.length
  });
}

function reducePreviousSong(state) {
  return Object.assign({}, state, {
    currentSong:
      (((state.currentSong - 1) % state.queueItems.length) +
        state.queueItems.length) %
      state.queueItems.length
  });
}

function reduceSelectStreamProviders(state) {
  return {
    ...state,
    queueItems: state.queueItems.map((item) => ({
      ...item,
      failed: false
    }))
  };
}

const reduceUpdateQueueItem = (state, action) => {
  const { item } = action.payload;
  const itemIndex = _.findIndex(state.queueItems, { uuid: item.uuid });
  const queueClone = _.cloneDeep(state.queueItems);
  queueClone[itemIndex] = item;

  return {
    ...state,
    queueItems: queueClone
  };
};

const reduceAddPlayNextItem = (state, action) => {
  return {
    ...state,
    queueItems: [
      ...state.queueItems.slice(0, state.currentSong + 1),
      action.payload.item,
      ...state.queueItems.slice(state.currentSong + 1)
    ]
  };
};

export default function QueueReducer(state = defaultState, action): QueueStore {
  logger.log('QueueReducer', action);
  switch (action.type) {
  case Queue.ADD_QUEUE_ITEM:
    return {
      ...state,
      queueItems: [
        ...state.queueItems,
        action.payload.item
      ]
    };
  case Queue.REMOVE_QUEUE_ITEM:
    return reduceRemoveFromQueue(state, action);
  case Queue.UPDATE_QUEUE_ITEM:
    return reduceUpdateQueueItem(state, action);
  case Queue.PLAY_NEXT_ITEM:
    return reduceAddPlayNextItem(state, action);
  case Queue.CLEAR_QUEUE:
    return { ...state, queueItems: [] };
  case Queue.NEXT_TRACK:
    return reduceNextSong(state);
  case Queue.PREVIOUS_TRACK:
    return reducePreviousSong(state);
  case Queue.SELECT_TRACK:
    return reduceSelectSong(state, action);
  case Queue.REPOSITION_TRACK:
    return reduceRepositionSong(state, action);
  case SELECT_STREAM_PROVIDER:
    return reduceSelectStreamProviders(state);
  default:
    return state;
  }
}
