import {
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
  CLEAR_QUEUE,
  ADD_STREAMS_TO_QUEUE_ITEM,
  REPLACE_STREAMS_IN_QUEUE_ITEM,
  NEXT_SONG,
  PREVIOUS_SONG,
  SELECT_SONG
} from '../actions/queue';

var _ = require('lodash');

const initialState = {
  queueItems: [],
  currentSong: 0
};

function findQueueItemIndex(queueItems, item) {
  return _.findIndex(queueItems, i => i.uuid===item.uuid);
}

export default function QueueReducer(state=initialState, action) {
  let replaceIx, removeIx, newQueue;
  switch (action.type) {
  case ADD_TO_QUEUE:
    return Object.assign({}, state, {
      queueItems: _.union(state.queueItems, [action.payload])
    });
  case REMOVE_FROM_QUEUE:
    let newCurrent = state.currentSong;
    removeIx = findQueueItemIndex(state.queueItems, action.payload);
    newQueue = _.cloneDeep(state.queueItems);
    newQueue = _.filter(newQueue, item => action.payload.uuid!==item.uuid);
    if (removeIx < state.currentSong) {
      newCurrent--;
    }
    return Object.assign({}, state, {
      queueItems: newQueue,
      currentSong: newCurrent
    });
  case CLEAR_QUEUE:
    return Object.assign({}, state, {
      queueItems: []
    });
  case ADD_STREAMS_TO_QUEUE_ITEM:
    replaceIx = findQueueItemIndex(state.queueItems, action.payload);
    newQueue = _.cloneDeep(state.queueItems);
    newQueue[replaceIx] = Object.assign({}, newQueue[replaceIx], action.payload);

    return Object.assign({}, state, {
      queueItems: newQueue
    });
  case REPLACE_STREAMS_IN_QUEUE_ITEM:
    replaceIx = findQueueItemIndex(state.queueItems, action.payload);
    newQueue = _.cloneDeep(state.queueItems);
    newQueue[replaceIx] = action.payload;
    return Object.assign({}, state, {
      queueItems: newQueue
    });
  case NEXT_SONG:
    return Object.assign({}, state, {
      currentSong: (state.currentSong+1) % state.queueItems.length
    });
  case PREVIOUS_SONG:
    return Object.assign({}, state, {
      currentSong: ((state.currentSong-1) % state.queueItems.length + state.queueItems.length) % state.queueItems.length
    });
  case SELECT_SONG:
    return Object.assign({}, state, {
      currentSong: action.payload
    })
  default:
    return state;
  }
}
