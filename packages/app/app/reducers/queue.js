import {
  ADD_QUEUE_ITEM,
  REMOVE_QUEUE_ITEM,
  UPDATE_QUEUE_ITEM,
  CLEAR_QUEUE,
  ADD_STREAMS_TO_QUEUE_ITEM,
  REPLACE_STREAMS_IN_QUEUE_ITEM,
  NEXT_SONG,
  PREVIOUS_SONG,
  SELECT_SONG,
  REPOSITION_SONG,
  STREAM_FAILED,
  CHANGE_TRACK_STREAM
} from '../actions/queue';
import { SELECT_STREAM_PROVIDER } from '../actions/plugins';

let _ = require('lodash');

const initialState = {
  queueItems: [],
  currentSong: 0
};

function findQueueItemIndex(queueItems, item) {
  return _.findIndex(queueItems, i => i.uuid === item.uuid);
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
  return { 
    ...state,
    queueItems: newQueue,
    currentSong: newCurrent
  };
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

function reduceRepositionSong(state, action) {
  let newQueue;
  newQueue = _.cloneDeep(state.queueItems);
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

function reduceStreamFailed(state) {
  return {
    ...state,
    queueItems: state.queueItems.map((item, idx) => {
      if (idx === state.currentSong) {
        return {
          ...item,
          error: {
            message: 'Could not find a working stream using this source.',
            details: 'Try re-rolling.'
          }
        };
      }
      return item;
    })
  };
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

function reduceChangeTrackStream(state, action) {
  const { track, stream } = action.payload;

  return {
    ...state,
    queueItems: state.queueItems.map((item) => {
      if (item.uuid === track.uuid) {
        return {
          ...item,
          failed: false,
          selectedStream: stream
        };
      }

      return item;
    })
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

export default function QueueReducer(state = initialState, action) {
  switch (action.type) {
  case ADD_QUEUE_ITEM:
    return {
      ...state,
      queueItems: _.union(state.queueItems, [action.payload.item])
    };
  case REMOVE_QUEUE_ITEM:
    return reduceRemoveFromQueue(state, action);
  case UPDATE_QUEUE_ITEM:
    return reduceUpdateQueueItem(state, action);
  case CLEAR_QUEUE:
    return { ...state, queueItems: [] };
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
  case REPOSITION_SONG:
    return reduceRepositionSong(state, action);
  case STREAM_FAILED:
    return reduceStreamFailed(state);
  case SELECT_STREAM_PROVIDER:
    return reduceSelectStreamProviders(state);
  case CHANGE_TRACK_STREAM:
    return reduceChangeTrackStream(state, action);
  default:
    return state;
  }
}
