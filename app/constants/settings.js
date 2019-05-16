import settingType from './settingsEnum';

module.exports = [
  {
    name: 'loopAfterQueueEnd',
    category: 'Playback',
    type: settingType.BOOLEAN,
    prettyName: 'Loop after playing the last queue item',
    default: false
  },
  {
    name: 'shuffleQueue',
    category: 'Playback',
    type: settingType.BOOLEAN,
    prettyName: 'Shuffle songs',
    default: false
  },
  {
    name: 'autoradio',
    category: 'Playback',
    type: settingType.BOOLEAN,
    prettyName: 'Autoradio',
    default: true
  },
  {
    name: 'notificationTimeout',
    category: 'Program settings',
    type: settingType.NUMBER,
    prettyName: 'Notification timeout',
    default: 3
  },
  {
    name: 'autoradioCraziness',
    category: 'Playback',
    type: settingType.NUMBER,
    prettyName: 'Autoradio craziness',
    default: 10,
    min: 1,
    max: 100,
    unit: ''
  },
  {
    name: 'disableGPU',
    category: 'Program settings',
    type: settingType.BOOLEAN,
    prettyName: 'Disable hardware rendering (might fix issues with dragging elements and flashing screen)',
    default: false
  },
  {
    name: 'framelessWindow',
    category: 'Program settings',
    type: settingType.BOOLEAN,
    prettyName: 'Frameless window (requires restart)',
    default: true
  },
  {
    name: 'compactMenuBar',
    category: 'Display',
    type: settingType.BOOLEAN,
    prettyName: 'Use compact style for menu bar',
    default: false
  },
  {
    name: 'compactQueueBar',
    category: 'Display',
    type: settingType.BOOLEAN,
    prettyName: 'Use compact style for queue bar',
    default: false
  },
  // To be enabled when MPD integration is ready
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
  {
    name: 'api.enabled',
    category: 'HTTP API',
    type: settingType.BOOLEAN,
    prettyName: 'Enable the api',
    default: true
  },  
  {
    name: 'api.port',
    category: 'HTTP API',
    type: settingType.NUMBER,
    prettyName: 'Port used by the api',
    default: 8080,
    min: 1024,
    max: 49151
  }
];
