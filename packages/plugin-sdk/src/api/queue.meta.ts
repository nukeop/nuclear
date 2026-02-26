import type { DomainMeta } from './meta';

export const QueueAPIMeta: DomainMeta = {
  description:
    'Manage the playback queue — add, remove, reorder tracks and control navigation.',
  methods: {
    getQueue: {
      description: 'Get the current queue state.',
      params: [],
      returns: 'Queue',
    },
    getCurrentItem: {
      description: 'Get the currently playing queue item.',
      params: [],
      returns: 'QueueItem | undefined',
    },
    addToQueue: {
      description: 'Add tracks to the end of the queue.',
      params: [{ name: 'tracks', type: 'Track[]' }],
      returns: 'void',
    },
    addNext: {
      description: 'Insert tracks immediately after the current item.',
      params: [{ name: 'tracks', type: 'Track[]' }],
      returns: 'void',
    },
    addAt: {
      description: 'Insert tracks at a specific position.',
      params: [
        { name: 'tracks', type: 'Track[]' },
        { name: 'index', type: 'number' },
      ],
      returns: 'void',
    },
    removeByIds: {
      description: 'Remove items from the queue by their IDs.',
      params: [{ name: 'ids', type: 'string[]' }],
      returns: 'void',
    },
    removeByIndices: {
      description: 'Remove items from the queue by their indices.',
      params: [{ name: 'indices', type: 'number[]' }],
      returns: 'void',
    },
    clearQueue: {
      description: 'Remove all items from the queue.',
      params: [],
      returns: 'void',
    },
    reorder: {
      description: 'Move a queue item from one position to another.',
      params: [
        { name: 'fromIndex', type: 'number' },
        { name: 'toIndex', type: 'number' },
      ],
      returns: 'void',
    },
    goToNext: {
      description: 'Skip to the next item.',
      params: [],
      returns: 'void',
    },
    goToPrevious: {
      description: 'Go back to the previous item.',
      params: [],
      returns: 'void',
    },
    goToIndex: {
      description: 'Jump to a specific position in the queue.',
      params: [{ name: 'index', type: 'number' }],
      returns: 'void',
    },
    goToId: {
      description: 'Jump to a specific queue item by its ID.',
      params: [{ name: 'id', type: 'string' }],
      returns: 'void',
    },
    setRepeatMode: {
      description: 'Set the repeat mode.',
      params: [{ name: 'mode', type: '"off" | "one" | "all"' }],
      returns: 'void',
    },
  },
};
