import {
  ADD_TO_QUEUE,
  ADD_TO_START_OF_QUEUE,
  REMOVE_FROM_QUEUE,
  CLEAR_QUEUE,
  ADD_STREAMS_TO_QUEUE_ITEM,
  REPLACE_STREAMS_IN_QUEUE_ITEM,
  NEXT_SONG,
  PREVIOUS_SONG,
  SELECT_SONG,
  SWAP_SONGS
} from '../actions/queue';

let _ = require('lodash');

const initialState = {
  queueItems: [],
  currentSong: 0
};

function findQueueItemIndex(queueItems, item) {
  return _.findIndex(queueItems, i => i.uuid === item.uuid);
}

function reduceAddToQueue(state, action) {
  return Object.assign({}, state, {
    queueItems: _.union(state.queueItems, [action.payload])
  });
}

function reduceAddToStartOfQueue(state, action) {
  let queue = state.queueItems;
  queue.unshift(action.payload);

  return Object.assign({}, state, {
    queueItems: queue
  });
}

function reduceRemoveFromQueue(state, action) {
  let removeIx, newQueue;
  let newCurrent = state.currentSong;
  removeIx = findQueueItemIndex(state.queueItems, action.payload);
  newQueue = _.cloneDeep(state.queueItems);
  newQueue = _.filter(newQueue, item => action.payload.uuid !== item.uuid);
  if (removeIx < state.currentSong) {
    newCurrent--;
  }
  return Object.assign({}, state, {
    queueItems: newQueue,
    currentSong: newCurrent
  });
}

function reduceClearQueue(state) {
  return Object.assign({}, state, {
    queueItems: []
  });
}

function reduceAddStreamsToQueueItem(state, action) {
  let replaceIx, newQueue;
  replaceIx = findQueueItemIndex(state.queueItems, action.payload);
  newQueue = _.cloneDeep(state.queueItems);
  newQueue[replaceIx] = Object.assign({}, newQueue[replaceIx], action.payload);

  return Object.assign({}, state, {
    queueItems: newQueue
  });
}

function reduceReplaceStreamsInQueueItem(state, action) {
  let replaceIx, newQueue;
  replaceIx = findQueueItemIndex(state.queueItems, action.payload);
  newQueue = _.cloneDeep(state.queueItems);
  newQueue[replaceIx] = action.payload;
  return Object.assign({}, state, {
    queueItems: newQueue
  });
}

function reduceSelectSong(state, action) {
  return Object.assign({}, state, {
    currentSong: action.payload
  });
}

function reduceSwapSongs(state, action) {
  let newQueue;
  newQueue = _.cloneDeep(state.queueItems);
  let temp = newQueue[action.payload.itemFrom];
  newQueue[action.payload.itemFrom] = newQueue[action.payload.itemTo];
  newQueue[action.payload.itemTo] = temp;
  return Object.assign({}, state, {
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

export default function QueueReducer(state = initialState, action) {
  switch (action.type) {
  case ADD_TO_QUEUE:
    return reduceAddToQueue(state, action);
  case ADD_TO_START_OF_QUEUE:
    return reduceAddToStartOfQueue(state, action);
  case REMOVE_FROM_QUEUE:
    return reduceRemoveFromQueue(state, action);
  case CLEAR_QUEUE:
    return reduceClearQueue(state);
  case ADD_STREAMS_TO_QUEUE_ITEM:
    return reduceAddStreamsToQueueItem(state, action);
  case REPLACE_STREAMS_IN_QUEUE_ITEM:
    return reduceReplaceStreamsInQueueItem(state, action);
  case NEXT_SONG:
    return reduceNextSong(state);
  case PREVIOUS_SONG:
    return reducePreviousSong(state);
  case SELECT_SONG:
    return reduceSelectSong(state, action);
  case SWAP_SONGS:
    return reduceSwapSongs(state, action);
  default:
    return state;
  }
}
