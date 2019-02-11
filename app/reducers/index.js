import { combineReducers } from 'redux';

import PlayerReducer from './player';
import PlaylistsReducer from './playlists';
import PluginsReducer from './plugins';
import QueueReducer from './queue';
import ScrobblingReducer from './scrobbling';
import SearchReducer from './search';
import SettingsReducer from './settings';
import DashboardReducer from './dashboard';
import TagReducer from './tag';
import ToastsReducer from './toasts';
import LyricsReducer from './lyrics';

const rootReducer = combineReducers({
  search: SearchReducer,
  queue: QueueReducer,
  plugin: PluginsReducer,
  player: PlayerReducer,
  scrobbling: ScrobblingReducer,
  playlists: PlaylistsReducer,
  dashboard: DashboardReducer,
  tags: TagReducer,
  settings: SettingsReducer,
  toasts: ToastsReducer,
  lyrics: LyricsReducer
});

export default rootReducer;
