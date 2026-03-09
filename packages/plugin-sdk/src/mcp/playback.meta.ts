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
    getVolume: {
      name: 'getVolume',
      description: 'Get the current volume level (0 to 1).',
      params: [],
      returns: 'number',
    },
    setVolume: {
      name: 'setVolume',
      description:
        'Set the volume level (0 to 1, where 0 is silent and 1 is full volume).',
      params: [{ name: 'volume', type: 'number' }],
      returns: 'void',
    },
    isMuted: {
      name: 'isMuted',
      description: 'Check whether audio output is muted.',
      params: [],
      returns: 'boolean',
    },
    setMuted: {
      name: 'setMuted',
      description: 'Mute or unmute audio.',
      params: [{ name: 'muted', type: 'boolean' }],
      returns: 'void',
    },
    isShuffleEnabled: {
      name: 'isShuffleEnabled',
      description: 'Check whether shuffle is enabled.',
      params: [],
      returns: 'boolean',
    },
    setShuffleEnabled: {
      name: 'setShuffleEnabled',
      description: 'Enable or disable shuffle.',
      params: [{ name: 'enabled', type: 'boolean' }],
      returns: 'void',
    },
    getRepeatMode: {
      name: 'getRepeatMode',
      description:
        'Get the current repeat mode: "off" (no repeat), "all" (repeat entire queue), or "one" (repeat current track).',
      params: [],
      returns: '"off" | "all" | "one"',
    },
    setRepeatMode: {
      name: 'setRepeatMode',
      description:
        'Set the repeat mode: "off" (no repeat), "all" (repeat entire queue), or "one" (repeat current track).',
      params: [{ name: 'mode', type: '"off" | "all" | "one"' }],
      returns: 'void',
    },
  },
};
