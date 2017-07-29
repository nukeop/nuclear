import {
  ADD_TO_QUEUE
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
    default:
      return state;
  }
}
