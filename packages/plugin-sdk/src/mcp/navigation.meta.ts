import type { DomainMeta } from './meta';

export const NavigationAPIMeta: DomainMeta = {
  description:
    'Navigate the player UI like the browser history API: open a page, go back and forward, read the current location.',
  methods: {
    navigate: {
      name: 'navigate',
      description:
        'Open the page at a player route path, for example /dashboard, /search?q=radiohead, /artist/<providerId>/<artistId>, /album/<providerId>/<albumId>, /playlists/<playlistId>, /favorites/tracks, /history, /lyrics.',
      params: [{ name: 'path', type: 'string' }],
      returns: 'void',
    },
    back: {
      name: 'back',
      description: 'Go back one page in the navigation history.',
      params: [],
      returns: 'void',
    },
    forward: {
      name: 'forward',
      description: 'Go forward one page in the navigation history.',
      params: [],
      returns: 'void',
    },
    current: {
      name: 'current',
      description: 'Get the location of the page the user is looking at.',
      params: [],
      returns: 'NavigationLocation',
    },
  },
};
