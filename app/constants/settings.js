module.exports = [
  {
    name: 'loopAfterQueueEnd',
    category: 'Playback',
    type: 'boolean',
    prettyName: 'Loop after playing the last queue item',
    default: false
  },
  {
    name: 'framelessWindow',
    category: 'Program settings',
    type: 'boolean',
    prettyName: 'Frameless window (requires restart)',
    default: true
  },
  {
    name: 'compactMenuBar',
    category: 'Display',
    type: 'boolean',
    prettyName: 'Use compact style for menu bar',
    default: false
  },
  {
    name: 'compactQueueBar',
    category: 'Display',
    type: 'boolean',
    prettyName: 'Use compact style for queue bar',
    default: false
  }
];
