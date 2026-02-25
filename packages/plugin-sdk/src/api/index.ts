import type { DashboardHost } from '../types/dashboard';
import type { FavoritesHost } from '../types/favorites';
import type { HttpHost } from '../types/http';
import type { LoggerHost } from '../types/logger';
import type { MetadataHost } from '../types/metadata';
import type { PlaylistsHost } from '../types/playlists';
import { ProvidersHost } from '../types/providers';
import type { QueueHost } from '../types/queue';
import type { SettingsHost } from '../types/settings';
import type { StreamingHost } from '../types/streaming';
import type { YtdlpHost } from '../types/ytdlp';
import { DashboardAPI } from './dashboard';
import { FavoritesAPI } from './favorites';
import { HttpAPI } from './http';
import { LoggerAPI } from './logger';
import { MetadataAPI } from './metadata';
import { PlaylistsAPI } from './playlists';
import { Providers } from './providers';
import { QueueAPI } from './queue';
import { Settings } from './settings';
import { StreamingAPI } from './streaming';
import { YtdlpAPI } from './ytdlp';

export class NuclearAPI {
  readonly Settings: Settings;
  readonly Providers: Providers;
  readonly Queue: QueueAPI;
  readonly Streaming: StreamingAPI;
  readonly Metadata: MetadataAPI;
  readonly Http: HttpAPI;
  readonly Ytdlp: YtdlpAPI;
  readonly Favorites: FavoritesAPI;
  readonly Logger: LoggerAPI;
  readonly Dashboard: DashboardAPI;
  readonly Playlists: PlaylistsAPI;

  constructor(opts?: {
    settingsHost?: SettingsHost;
    providersHost?: ProvidersHost;
    queueHost?: QueueHost;
    streamingHost?: StreamingHost;
    metadataHost?: MetadataHost;
    httpHost?: HttpHost;
    ytdlpHost?: YtdlpHost;
    favoritesHost?: FavoritesHost;
    loggerHost?: LoggerHost;
    dashboardHost?: DashboardHost;
    playlistsHost?: PlaylistsHost;
  }) {
    this.Settings = new Settings(opts?.settingsHost);
    this.Providers = new Providers(opts?.providersHost);
    this.Queue = new QueueAPI(opts?.queueHost);
    this.Streaming = new StreamingAPI(opts?.streamingHost);
    this.Metadata = new MetadataAPI(opts?.metadataHost);
    this.Http = new HttpAPI(opts?.httpHost);
    this.Ytdlp = new YtdlpAPI(opts?.ytdlpHost);
    this.Favorites = new FavoritesAPI(opts?.favoritesHost);
    this.Logger = new LoggerAPI(opts?.loggerHost);
    this.Dashboard = new DashboardAPI(opts?.dashboardHost);
    this.Playlists = new PlaylistsAPI(opts?.playlistsHost);
  }
}

export class NuclearPluginAPI extends NuclearAPI {}
