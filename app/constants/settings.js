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
  {
    name: 'mpd.host',
    category: 'MPD',
    type: settingType.STRING,
    prettyName: 'MPD host address',
    default: 'localhost:6600'
  },
  {
    name: 'mpd.httpstream',
    category: 'MPD',
    type: settingType.STRING,
    prettyName: 'MPD HTTP stream address',
    default: 'localhost:8888'
  }
];
