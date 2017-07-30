import { combineReducers } from 'redux';

import PluginsReducer from './plugins';
import QueueReducer from './queue';
import SearchReducer from './search';

const rootReducer = combineReducers({
  search: SearchReducer,
  queue: QueueReducer,
  plugin: PluginsReducer
});

export default rootReducer;
