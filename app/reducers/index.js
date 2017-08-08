import { combineReducers } from 'redux';

import PlayerReducer from './player';
import PluginsReducer from './plugins';
import QueueReducer from './queue';
import ScrobblingReducer from './scrobbling';
import SearchReducer from './search';

const rootReducer = combineReducers({
  search: SearchReducer,
  queue: QueueReducer,
  plugin: PluginsReducer,
  player: PlayerReducer,
  scrobbling: ScrobblingReducer
});

export default rootReducer;
