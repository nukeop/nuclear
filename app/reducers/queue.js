import {
  ADD_TO_QUEUE,
  ADD_STREAMS_TO_QUEUE_ITEM
} from '../actions/queue';

var _ = require('lodash');

const initialState = {
  queueItems: []
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
    default:
      return state;
  }
}
