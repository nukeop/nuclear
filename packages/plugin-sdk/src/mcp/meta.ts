import { DashboardAPIMeta } from './dashboard.meta';
import { FavoritesAPIMeta } from './favorites.meta';
import { MetadataAPIMeta } from './metadata.meta';
import { PlaybackAPIMeta } from './playback.meta';
import { PlaylistsAPIMeta } from './playlists.meta';
import { ProvidersAPIMeta } from './providers.meta';
import { QueueAPIMeta } from './queue.meta';

export type ParamMeta = {
  name: string;
  type: string;
};

export type MethodMeta = {
  name: string;
  description: string;
  params: ParamMeta[];
  returns: string;
};

export type DomainMeta = {
  description: string;
  methods: Record<string, MethodMeta>;
};

export type ApiMeta = Record<string, DomainMeta>;

export const apiMeta: ApiMeta = {
  Queue: QueueAPIMeta,
  Playback: PlaybackAPIMeta,
  Metadata: MetadataAPIMeta,
  Favorites: FavoritesAPIMeta,
  Playlists: PlaylistsAPIMeta,
  Dashboard: DashboardAPIMeta,
  Providers: ProvidersAPIMeta,
};
