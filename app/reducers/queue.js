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
      let newQueue = Object.assign({}, state.queueItems);
    //  newQueue[replaceIx] = Object.assign({}, action.payload.item, {streams: action.payload.streams, loading: false});
    //  newQueue = _.map(Object.keys(newQueue), key => newQueue[key]);

      return Object.assign({}, state, {
        queueItems: newQueue
      });
    default:
      return state;
  }
}
