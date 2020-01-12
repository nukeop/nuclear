import { app, remote } from 'electron';

export enum SettingType {
  BOOLEAN = 'boolean',
  LIST = 'list',
  NODE = 'node',
  NUMBER = 'number',
  STRING = 'string',
  DIRECTORY = 'directory'
}

type SettingOption = {
  key: string;
  text: string;
  value: string;
}

type Setting = {
  name: string;
  category: string;
  description?: string;
  type: SettingType;
  prettyName: string;
  default?: boolean | number | string;

  options?: Array<SettingOption>;
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
  buttonText?: string;
  buttonIcon?: string;
}

export const settingsConfig: Array<Setting> = [
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
    name: 'yt.apiKey',
    category: 'youtube',
    type: SettingType.STRING,
    prettyName: 'yt-api-key'
    // default: globals.ytApiKey
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
      { key: 'en', text: 'English', value: 'en' },
      { key: 'en-US', text: 'English (US)', value: 'en-US' },
      { key: 'es', text: 'Español', value: 'es' },
      { key: 'fr', text: 'Français', value: 'fr' },
      { key: 'it', text: 'Italiano', value: 'it' },
      { key: 'nl', text: 'Nederlands', value: 'nl' },
      { key: 'pl', text: 'Polski', value: 'pl' },
      { key: 'pt_br', text: 'Português (Brasil)', value: 'pt_br' },
      { key: 'ru', text: 'Русский', value: 'ru' },
      { key: 'tr', text: 'Türkçe', value: 'tr' },
      { key: 'zh', text: '简体中文', value: 'zh' },
      { key: 'zh_tw', text: '繁體中文', value: 'zh_tw' },
      { key: 'id', text: 'Bahasa Indonesia', value: 'id' },
      { key: 'sk', text: 'Slovenčina', value: 'sk' },
      { key: 'ko', text: '한국어', value: 'ko' },
      { key: 'tl', text: 'Tagalog (Filipino)', value: 'tl' }
    ],
    default: undefined
  }, {
    name: 'downloads.dir',
    category: 'downloads',
    type: SettingType.DIRECTORY,
    prettyName: 'downloads-dir',
    buttonText: 'downloads-dir-button',
    buttonIcon: 'folder open',
    default: app ? app.getPath('downloads') : remote.app.getPath('downloads')
  }

  // TODO: Enable when MPD integration is ready
  // {
  //   name: 'mpd.host',
  //   category: 'MPD',
  //   type: SettingType.STRING,
  //   prettyName: 'MPD host address',
  //   default: 'localhost:6600'
  // },
  // {
  //   name: 'mpd.httpstream',
  //   category: 'MPD',
  //   type: SettingType.STRING,
  //   prettyName: 'MPD HTTP stream address',
  //   default: 'localhost:8888'
  // },
];
