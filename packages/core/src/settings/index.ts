import { app, remote } from 'electron';
import { v4 } from 'uuid';

export enum SettingType {
  BOOLEAN = 'boolean',
  LIST = 'list',
  NODE = 'node',
  NUMBER = 'number',
  STRING = 'string',
  DIRECTORY = 'directory',
}

type SettingCategory =
  | 'audio'
  | 'playback'
  | 'program-settings'
  | 'display'
  | 'http'
  | 'streaming'
  | 'downloads'
  | 'developer'
  | 'visualizer'
  | 'social';

type SettingOption = {
  key: string;
  text: string;
  value: string;
};

export type Setting = {
  name: string;
  category: SettingCategory;
  description?: string;
  type: SettingType;
  prettyName: string;
  default?: boolean | number | string;
  hide?: boolean;

  options?: Array<SettingOption>;
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
  buttonText?: string;
  buttonIcon?: string;
};

export const settingsConfig: Array<Setting> = [
  // ADDED BY MISH GH
  {
    name: 'rate',
    category: 'audio',
    type: SettingType.BOOLEAN,
    // description: 'playback-rate-description',
    prettyName: 'rate-play-option',
    default: false
  },
  // END
  {
    name: 'volume',
    category: 'audio',
    description: 'volume-description',
    type: SettingType.NUMBER,
    prettyName: 'volume',
    default: 50,
    hide: true
  },
  {
    name: 'normalize',
    category: 'audio',
    description: 'normalize-description',
    type: SettingType.BOOLEAN,
    prettyName: 'normalize',
    default: false
  },
  {
    name: 'loopAfterQueueEnd',
    category: 'playback',
    type: SettingType.BOOLEAN,
    prettyName: 'loop-after-queue-end',
    default: false
  },
  {
    name: 'shuffleQueue',
    category: 'playback',
    type: SettingType.BOOLEAN,
    prettyName: 'shuffle-queue',
    default: false
  },
  {
    name: 'shuffleWhenGoingBack',
    category: 'playback',
    description: 'shuffle-when-going-back-description',
    type: SettingType.BOOLEAN,
    prettyName: 'shuffle-when-going-back',
    default: false
  },
  {
    name: 'autoradio',
    category: 'playback',
    description: 'autoradio-description',
    type: SettingType.BOOLEAN,
    prettyName: 'autoradio',
    default: true
  },
  {
    name: 'seekIteration',
    category: 'playback',
    type: SettingType.NUMBER,
    prettyName: 'seek-iteration',
    default: 10
  },
  {
    name: 'listeningHistory',
    category: 'playback',
    description: 'listening-history-description',
    type: SettingType.BOOLEAN,
    prettyName: 'listening-history',
    default: true
  },
  {
    name: 'notificationTimeout',
    category: 'program-settings',
    type: SettingType.NUMBER,
    prettyName: 'notification-timeout',
    default: 3
  },
  {
    name: 'autoradioCraziness',
    category: 'playback',
    description: 'autoradio-craziness-description',
    type: SettingType.NUMBER,
    prettyName: 'autoradio-craziness',
    default: 10,
    min: 1,
    max: 100,
    unit: ''
  },
  {
    name: 'skipSponsorblock',
    category: 'playback',
    description: 'skip-sponsorblock-description',
    type: SettingType.BOOLEAN,
    prettyName: 'skip-sponsorblock',
    default: true
  },
  {
    name: 'disableGPU',
    category: 'program-settings',
    type: SettingType.BOOLEAN,
    prettyName: 'disable-gpu',
    default: false
  },
  {
    name: 'framelessWindow',
    category: 'program-settings',
    type: SettingType.BOOLEAN,
    prettyName: 'frameless-window',
    default: true
  },
  {
    name: 'showTrayIcon',
    category: 'program-settings',
    type: SettingType.BOOLEAN,
    prettyName: 'show-tray-icon',
    default: true
  },
  {
    name: 'miniPlayer',
    category: 'display',
    type: SettingType.BOOLEAN,
    prettyName: 'mini-player',
    default: false
  },
  {
    name: 'discordRichPresence',
    category: 'display',
    type: SettingType.BOOLEAN,
    prettyName: 'discord-rich-presence',
    default: true
  },
  {
    name: 'compactMenuBar',
    category: 'display',
    type: SettingType.BOOLEAN,
    prettyName: 'compact-menu-bar',
    default: false
  },
  {
    name: 'compactQueueBar',
    category: 'display',
    type: SettingType.BOOLEAN,
    prettyName: 'compact-queue-bar',
    default: false
  },
  {
    name: 'trackDuration',
    category: 'display',
    type: SettingType.BOOLEAN,
    prettyName: 'track-duration',
    default: true
  },
  {
    name: 'promotedArtists',
    category: 'display',
    type: SettingType.BOOLEAN,
    prettyName: 'promoted-artists',
    description: 'promoted-artists-description',
    default: true
  },
  {
    name: 'api.enabled',
    category: 'http',
    type: SettingType.BOOLEAN,
    prettyName: 'enable-api',
    default: false
  },
  {
    name: 'api.port',
    category: 'http',
    type: SettingType.NUMBER,
    prettyName: 'api-port',
    default: 3100,
    min: 1024,
    max: 49151
  },
  {
    name: 'invidious.url',
    category: 'streaming',
    type: SettingType.STRING,
    prettyName: 'invidious-url'
  },
  {
    name: 'language',
    category: 'program-settings',
    type: SettingType.LIST,
    prettyName: 'language',
    placeholder: 'language-placeholder',
    options: [
      { key: 'cs', text: 'Česky', value: 'cs' },
      { key: 'de', text: 'Deutsch', value: 'de' },
      { key: 'dk', text: 'Dansk', value: 'dk' },
      { key: 'en-US', text: 'English (US)', value: 'en-US' },
      { key: 'en', text: 'English', value: 'en' },
      { key: 'es', text: 'Español', value: 'es' },
      { key: 'fi', text: 'Suomi', value: 'fi' },
      { key: 'fr', text: 'Français', value: 'fr' },
      { key: 'gr', text: 'Greek', value: 'gr' },
      { key: 'he_IL', text: 'עברית', value: 'he_IL' },
      { key: 'hi_IN', text: 'Hindi', value: 'hi_IN' },
      { key: 'hr', text: 'Hrvatski', value: 'hr' },
      { key: 'id', text: 'Bahasa Indonesia', value: 'id' },
      { key: 'is', text: 'Íslenska', value: 'is' },
      { key: 'it', text: 'Italiano', value: 'it' },
      { key: 'ja_JP', text: '日本語', value: 'ja_JP' },
      { key: 'ko', text: '한국어', value: 'ko' },
      { key: 'ku_KMR', text: 'Kurdî', value: 'ku_KMR' },
      { key: 'lt_LT', text: 'Lietuvių', value: 'lt_LT' },
      { key: 'lv_LV', text: 'Latviešu', value: 'lv_LV' },
      { key: 'nl', text: 'Nederlands', value: 'nl' },
      { key: 'no_NO', text: 'Norsk', value: 'no_NO' },
      { key: 'pl', text: 'Polski', value: 'pl' },
      { key: 'pt_BR', text: 'Português (Brasil)', value: 'pt_BR' },
      { key: 'ru', text: 'Русский', value: 'ru' },
      { key: 'se', text: 'Svenska', value: 'se' },
      { key: 'sk', text: 'Slovenčina', value: 'sk' },
      { key: 'sq', text: 'Shqip', value: 'sq' },
      { key: 'tl', text: 'Tagalog (Filipino)', value: 'tl' },
      { key: 'tr', text: 'Türkçe', value: 'tr' },
      { key: 'vi', text: 'Vietnamese', value: 'vi' },
      { key: 'yue_CN', text: '粵語', value: 'yue_CN' },
      { key: 'zh_TW', text: '繁體中文', value: 'zh_TW' },
      { key: 'zh_CN', text: '简体中文', value: 'zh_CN' }
    ],
    default: undefined
  },
  {
    name: 'downloads.dir',
    category: 'downloads',
    type: SettingType.DIRECTORY,
    prettyName: 'downloads-dir',
    buttonText: 'downloads-dir-button',
    buttonIcon: 'folder open',
    default: app
      ? app.getPath('downloads')
      : remote
        ? remote.app.getPath('downloads')
        : ''
  },
  {
    name: 'max.downloads',
    category: 'downloads',
    type: SettingType.NUMBER,
    prettyName: 'downloads-count',
    default: 1,
    min: 1
  },
  {
    name: 'devtools',
    category: 'developer',
    type: SettingType.BOOLEAN,
    prettyName: 'devtools',
    default: false
  },
  {
    name: 'visualizer.preset',
    category: 'visualizer',
    type: SettingType.STRING,
    prettyName: 'visualizer-preset',
    default: '$$$ Royal - Mashup (431)',
    hide: true
  },
  {
    name: 'mastodonInstance',
    prettyName: 'mastodon-instance',
    category: 'social',
    type: SettingType.STRING,
    default: 'https://mastodon.social',
    hide: true
  },
  {
    name: 'mastodonAuthorizationCode',
    prettyName: 'mastodon-authorization-code',
    category: 'social',
    type: SettingType.STRING,
    default: '',
    hide: true
  },
  {
    name: 'mastodonAccessToken',
    prettyName: 'mastodon-access-token',
    category: 'social',
    type: SettingType.STRING,
    default: '',
    hide: true
  },
  {
    name: 'mastodonPostFormat',
    prettyName: 'mastodon-post-format',
    category: 'social',
    type: SettingType.STRING,
    default:
      '#nowplaying {{artist}} - {{title}} #nuclear https://nuclear.js.org',
    hide: true
  },
  {
    name: 'nuclearIdentityServiceUrl',
    prettyName: 'nuclear-identity-service-url',
    category: 'social',
    type: SettingType.STRING,
    default: 'http://localhost:3000',
    hide: true
  },
  {
    name: 'nuclearPlaylistsServiceUrl',
    prettyName: 'nuclear-playlists-service-url',
    category: 'social',
    type: SettingType.STRING,
    default: 'http://localhost:3010',
    hide: true
  },
  {
    name: 'userId',
    prettyName: 'user-id',
    category: 'program-settings',
    type: SettingType.STRING,
    hide: true
  },
  {
    name: 'useStreamVerification',
    prettyName: 'use-stream-verification',
    description: 'use-stream-verification-description',
    category: 'playback',
    type: SettingType.BOOLEAN,
    default: true
  }
];
