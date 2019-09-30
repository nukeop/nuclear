import globals from '../app/globals';
import settingType from './settingsEnum';

export default [
  {
    name: 'loopAfterQueueEnd',
    category: 'playback',
    type: settingType.BOOLEAN,
    prettyName: 'loop-after-queue-end',
    default: false
  },
  {
    name: 'shuffleQueue',
    category: 'playback',
    type: settingType.BOOLEAN,
    prettyName: 'shuffle-queue',
    default: false
  },
  {
    name: 'shuffleWhenGoingBack',
    category: 'playback',
    description: 'shuffle-when-going-back-description',
    type: settingType.BOOLEAN,
    prettyName: 'shuffle-when-going-back',
    default: false
  },
  {
    name: 'autoradio',
    category: 'playback',
    description: 'autoradio-description',
    type: settingType.BOOLEAN,
    prettyName: 'autoradio',
    default: true
  },
  {
    name: 'seekIteration',
    category: 'playback',
    type: settingType.NUMBER,
    prettyName: 'seek-iteration',
    default: 10
  },
  {
    name: 'notificationTimeout',
    category: 'program-settings',
    type: settingType.NUMBER,
    prettyName: 'notification-timeout',
    default: 3
  },
  {
    name: 'autoradioCraziness',
    category: 'playback',
    description: 'autoradio-craziness-description',
    type: settingType.NUMBER,
    prettyName: 'autoradio-craziness',
    default: 10,
    min: 1,
    max: 100,
    unit: ''
  },
  {
    name: 'disableGPU',
    category: 'program-settings',
    type: settingType.BOOLEAN,
    prettyName: 'disable-gpu',
    default: false
  },
  {
    name: 'framelessWindow',
    category: 'program-settings',
    type: settingType.BOOLEAN,
    prettyName: 'frameless-window',
    default: true
  },
  {
    name: 'compactMenuBar',
    category: 'display',
    type: settingType.BOOLEAN,
    prettyName: 'compact-menu-bar',
    default: false
  },
  {
    name: 'compactQueueBar',
    category: 'display',
    type: settingType.BOOLEAN,
    prettyName: 'compact-queue-bar',
    default: false
  },
  {
    name: 'trackDuration',
    category: 'display',
    type: settingType.BOOLEAN,
    prettyName: 'track-duration',
    default: true
  },
  {
    name: 'api.enabled',
    category: 'http',
    type: settingType.BOOLEAN,
    prettyName: 'enable-api',
    default: false
  },
  {
    name: 'api.port',
    category: 'http',
    type: settingType.NUMBER,
    prettyName: 'api-port',
    default: 3100,
    min: 1024,
    max: 49151
  },
  {
    name: 'yt.apiKey',
    category: 'youtube',
    type: settingType.STRING,
    prettyName: 'yt-api-key',
    default: globals.ytApiKey
  },
  {
    name: 'language',
    category: 'program-settings',
    type: settingType.LIST,
    prettyName: 'language',
    placeholder: 'language-placeholder',
    options: [
      { key: 'de', text: 'Deutsch', value: 'de' },
      { key: 'dk', text: 'Dansk', value: 'dk' },
      { key: 'en', text: 'English', value: 'en' },
      { key: 'es', text: 'Español', value: 'es' },
      { key: 'fr', text: 'Français', value: 'fr' },
      { key: 'it', text: 'Italiano', value: 'it' },
      { key: 'nl', text: 'Nederlands', value: 'nl' },
      { key: 'pl', text: 'Polski', value: 'pl' },
      { key: 'pt_br', text: 'Português (Brasil)', value: 'pt_br' },
      { key: 'ru', text: 'Русский', value: 'ru' },
      { key: 'tr', text: 'Türkçe', value: 'tr' },
      { key: 'zh', text: '中文', value: 'zh' },
      { key: 'id', text: 'Bahasa Indonesia', value: 'id' }
    ],
    default: undefined
  }, {
    name: 'downloads.dir',
    category: 'downloads',
    type: settingType.DIRECTORY,
    prettyName: 'downloads-dir',
    buttonText: 'downloads-dir-button',
    buttonIcon: 'folder open'
  }

  // TODO: Enable when MPD integration is ready
  // {
  //   name: 'mpd.host',
  //   category: 'MPD',
  //   type: settingType.STRING,
  //   prettyName: 'MPD host address',
  //   default: 'localhost:6600'
  // },
  // {
  //   name: 'mpd.httpstream',
  //   category: 'MPD',
  //   type: settingType.STRING,
  //   prettyName: 'MPD HTTP stream address',
  //   default: 'localhost:8888'
  // },
];
