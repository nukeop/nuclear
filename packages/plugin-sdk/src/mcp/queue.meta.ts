import type { DomainMeta } from './meta';

export const QueueAPIMeta: DomainMeta = {
  description:
    'Manage the playback queue — add, remove, reorder tracks and control navigation.',
  methods: {
    getQueue: {
      name: 'getQueue',
      description: 'Get the current queue state.',
      params: [],
      returns: 'Queue',
    },
    getCurrentItem: {
      name: 'getCurrentItem',
      description: 'Get the currently playing queue item.',
      params: [],
      returns: 'QueueItem | undefined',
    },
    addToQueue: {
      name: 'addToQueue',
      description: 'Add tracks to the end of the queue.',
      params: [{ name: 'tracks', type: 'Track[]' }],
      returns: 'void',
    },
    addNext: {
      name: 'addNext',
      description: 'Insert tracks immediately after the current item.',
      params: [{ name: 'tracks', type: 'Track[]' }],
      returns: 'void',
    },
    addAt: {
      name: 'addAt',
      description: 'Insert tracks at a specific position.',
      params: [
        { name: 'tracks', type: 'Track[]' },
        { name: 'index', type: 'number' },
      ],
      returns: 'void',
    },
    removeByIds: {
      name: 'removeByIds',
      description: 'Remove items from the queue by their IDs.',
      params: [{ name: 'ids', type: 'string[]' }],
      returns: 'void',
    },
    removeByIndices: {
      name: 'removeByIndices',
      description: 'Remove items from the queue by their indices.',
      params: [{ name: 'indices', type: 'number[]' }],
      returns: 'void',
    },
    clearQueue: {
      name: 'clearQueue',
      description: 'Remove all items from the queue.',
      params: [],
      returns: 'void',
    },
    reorder: {
      name: 'reorder',
      description: 'Move a queue item from one position to another.',
      params: [
        { name: 'fromIndex', type: 'number' },
        { name: 'toIndex', type: 'number' },
      ],
      returns: 'void',
    },
    goToNext: {
      name: 'goToNext',
      description: 'Skip to the next item.',
      params: [],
      returns: 'void',
    },
    goToPrevious: {
      name: 'goToPrevious',
      description: 'Go back to the previous item.',
      params: [],
      returns: 'void',
    },
    goToIndex: {
      name: 'goToIndex',
      description: 'Jump to a specific position in the queue.',
      params: [{ name: 'index', type: 'number' }],
      returns: 'void',
    },
    goToId: {
      name: 'goToId',
      description: 'Jump to a specific queue item by its ID.',
      params: [{ name: 'id', type: 'string' }],
      returns: 'void',
    },
    updateItemState: {
      name: 'updateItemState',
      description: 'Update the loading status of a queue item.',
      params: [
        { name: 'id', type: 'string' },
        { name: 'updates', type: 'QueueItemStateUpdate' },
      ],
      returns: 'void',
    },
  },
};
