import type { DomainMeta } from './meta';

export const PlaybackAPIMeta: DomainMeta = {
  description: 'Control audio playback state, transport, and seeking.',
  methods: {
    getState: {
      name: 'getState',
      description:
        'Get the current playback state (status, seek position, duration).',
      params: [],
      returns: 'PlaybackState',
    },
    play: {
      name: 'play',
      description: 'Start or resume playback.',
      params: [],
      returns: 'void',
    },
    pause: {
      name: 'pause',
      description: 'Pause playback.',
      params: [],
      returns: 'void',
    },
    stop: {
      name: 'stop',
      description: 'Stop playback and reset position.',
      params: [],
      returns: 'void',
    },
    toggle: {
      name: 'toggle',
      description: 'Toggle between play and pause.',
      params: [],
      returns: 'void',
    },
    seekTo: {
      name: 'seekTo',
      description: 'Seek to a position in seconds.',
      params: [{ name: 'seconds', type: 'number' }],
      returns: 'void',
    },
  },
};
