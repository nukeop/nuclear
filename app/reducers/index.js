import { combineReducers } from 'redux';

import QueueReducer from './queue';
import SearchReducer from './search';

const rootReducer = combineReducers({
  search: SearchReducer,
  queue: QueueReducer
});

export default rootReducer;
