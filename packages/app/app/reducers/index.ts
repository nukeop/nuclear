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
import {reducer as PlaylistsReducer} from './playlists';
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
import { reducer as NuclearReducer } from './nuclear';

const rootReducer = combineReducers({
  connectivity: ConnectivityReducer,
  dashboard: DashboardReducer,
  downloads: DownloadsReducer,
  equalizer: EqualizerReducer,
  favorites: FavoritesReducer,
  github: GithubReducer,
  githubContrib: GithubContribReducer,
  importfavs: ImportFavsReducer,
  local: LocalLibraryReducer,
  lyrics: LyricsReducer,
  mastodon: MastodonReducer,
  nuclear: NuclearReducer,
  player: PlayerReducer,
  playlists: PlaylistsReducer,
  plugin: PluginsReducer,
  queue: QueueReducer,
  scrobbling: ScrobblingReducer,
  search: SearchReducer,
  settings: SettingsReducer,
  tags: TagReducer,
  toasts: ToastsReducer
});

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
