import { combineReducers } from 'redux';

import PlayerReducer from './player';
import PlaylistsReducer from './playlists';
import PluginsReducer from './plugins';
import QueueReducer from './queue';
import ScrobblingReducer from './scrobbling';
import SearchReducer from './search';
import DashboardReducer from './dashboard';
import TagReducer from './tag';

const rootReducer = combineReducers({
  search: SearchReducer,
  queue: QueueReducer,
  plugin: PluginsReducer,
  player: PlayerReducer,
  scrobbling: ScrobblingReducer,
  playlists: PlaylistsReducer,
  dashboard: DashboardReducer,
  tags: TagReducer
});

export default rootReducer;
