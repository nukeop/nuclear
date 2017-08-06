import { combineReducers } from 'redux';

import PlayerReducer from './player';
import PluginsReducer from './plugins';
import QueueReducer from './queue';
import SearchReducer from './search';

const rootReducer = combineReducers({
  search: SearchReducer,
  queue: QueueReducer,
  plugin: PluginsReducer,
  player: PlayerReducer
});

export default rootReducer;
