import globals from '../globals';
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
    name: 'autoradio',
    category: 'playback',
    type: settingType.BOOLEAN,
    prettyName: 'autoradio',
    default: true
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
    name: 'api.enabled',
    category: 'http',
    type: settingType.BOOLEAN,
    prettyName: 'enable-api',
    default: true
  },
  {
    name: 'api.port',
    category: 'http',
    type: settingType.NUMBER,
    prettyName: 'api-port',
    default: 8080,
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
      {key: 'en', text: 'English', value: 'en'},
      {key: 'fr', text: 'French', value: 'fr'},
      {key: 'nl', text: 'Dutch', value: 'nl'},
      {key: 'de', text: 'German', value: 'de'},
      {key: 'dk', text: 'Danish', value: 'dk'},
      {key: 'es', text: 'Spanish', value: 'es'},
      {key: 'pl', text: 'Polish', value: 'pl'},
      {key: 'zh', text: 'Chinese', value: 'zh'},
      {key: 'ru', text: 'Russian', value: 'ru'},
      {key: 'pt_br', text: 'Português do Brasil', value: 'pt_br'}
    ],
    default: undefined
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
