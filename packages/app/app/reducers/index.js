import { combineReducers } from 'redux';

import DashboardReducer from './dashboard';
import DownloadsReducer from './downloads';
import EqualizerReducer from './equalizer';
import FavoritesReducer from './favorites';
import GithubReducer from './github';
import LyricsReducer from './lyrics';
import PlayerReducer from './player';
import PlaylistsReducer from './playlists';
import PluginsReducer from './plugins';
import QueueReducer from './queue';
import ScrobblingReducer from './scrobbling';
import SearchReducer from './search';
import SettingsReducer from './settings';
import TagReducer from './tag';
import ToastsReducer from './toasts';
import LocalReducer from './local';
import ConnectivityReducer from './connectivity';

const rootReducer = combineReducers({
  dashboard: DashboardReducer,
  downloads: DownloadsReducer,
  equalizer: EqualizerReducer,
  favorites: FavoritesReducer,
  github: GithubReducer,
  lyrics: LyricsReducer,
  player: PlayerReducer,
  playlists: PlaylistsReducer,
  plugin: PluginsReducer,
  queue: QueueReducer,
  scrobbling: ScrobblingReducer,
  search: SearchReducer,
  settings: SettingsReducer,
  tags: TagReducer,
  toasts: ToastsReducer,
  local: LocalReducer,
  connectivity: ConnectivityReducer
});

export default rootReducer;
