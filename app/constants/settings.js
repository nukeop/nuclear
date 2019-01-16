module.exports = [
  {
    name: 'loopAfterQueueEnd',
    category: 'Playback',
    type: 'boolean',
    prettyName: 'Loop after playing the last queue item',
    default: false,
  },
  {
    name: 'shuffleQueue',
    category: 'Playback',
    type: 'boolean',
    prettyName: 'Shuffle songs',
    default: false,
  },
  {
    name: 'autoradio',
    category: 'Playback',
    type: 'boolean',
    prettyName: 'Autoradio',
    default: true,
  },
  {
    name: 'framelessWindow',
    category: 'Program settings',
    type: 'boolean',
    prettyName: 'Frameless window (requires restart)',
    default: true,
  },
  {
    name: 'compactMenuBar',
    category: 'Display',
    type: 'boolean',
    prettyName: 'Use compact style for menu bar',
    default: false,
  },
  {
    name: 'compactQueueBar',
    category: 'Display',
    type: 'boolean',
    prettyName: 'Use compact style for queue bar',
    default: false,
  },
  {
    name: 'mpd.host',
    category: 'MPD',
    type: 'string',
    prettyName: 'MPD host address',
    default: 'localhost:6600'
  },
  {
    name: 'mpd.httpstream',
    category: 'MPD',
    type: 'string',
    prettyName: 'MPD HTTP stream address',
    default: 'localhost:8888'
  }
];
