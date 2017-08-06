import {
  ADD_TO_QUEUE,
  ADD_STREAMS_TO_QUEUE_ITEM,
  NEXT_SONG,
  PREVIOUS_SONG,
  SELECT_SONG
} from '../actions/queue';

var _ = require('lodash');

const initialState = {
  queueItems: [],
  currentSong: 0
};

export default function QueueReducer(state=initialState, action) {
  switch (action.type) {
    case ADD_TO_QUEUE:
      return Object.assign({}, state, {
        queueItems: _.union(state.queueItems, [action.payload])
      })
    case ADD_STREAMS_TO_QUEUE_ITEM:
      let replaceIx = _.findIndex(state.queueItems, item => action.payload.artist===item.artist && action.payload.name ===item.name);
      let newQueue = _.cloneDeep(state.queueItems);
      newQueue[replaceIx] = Object.assign({}, newQueue[replaceIx], action.payload);

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
