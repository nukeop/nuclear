import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import DashboardReducer from './dashboard';
import DownloadsReducer from './downloads';
import EqualizerReducer from './equalizer';
import FavoritesReducer from './favorites';
import GithubReducer from './github';
import GithubContribReducer from './githubContrib';
import LyricsReducer from './lyrics';
import PlayerReducer from './player';
import PlaylistsReducer from './playlists';
import PluginsReducer from './plugins';
import QueueReducer from './queue';
import ScrobblingReducer from './scrobbling';
import ImportFavsReducer from './importfavs';
import SearchReducer from './search';
import SettingsReducer from './settings';
import TagReducer from './tag';
import ToastsReducer from './toasts';
import ConnectivityReducer from './connectivity';
import { reducer as LocalLibraryReducer } from './local';
import { reducer as MastodonReducer } from './mastodon';

const rootReducer = combineReducers({
  dashboard: DashboardReducer,
  downloads: DownloadsReducer,
  equalizer: EqualizerReducer,
  favorites: FavoritesReducer,
  github: GithubReducer,
  githubContrib: GithubContribReducer,
  lyrics: LyricsReducer,
  player: PlayerReducer,
  playlists: PlaylistsReducer,
  plugin: PluginsReducer,
  queue: QueueReducer,
  scrobbling: ScrobblingReducer,
  importfavs: ImportFavsReducer,
  search: SearchReducer,
  settings: SettingsReducer,
  tags: TagReducer,
  toasts: ToastsReducer,
  connectivity: ConnectivityReducer,
  local: LocalLibraryReducer,
  mastodon: MastodonReducer
});

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
