import type { DomainMeta } from './meta';

export const ViewsAPIMeta: DomainMeta = {
  description: 'Adds views to the left sidebar of the player.',
  methods: {
    register: {
      name: 'register',
      description:
        'Adds a view to the left sidebar. To replace a view, call register again with the same id. The view opens at /plugin/bridge/<viewId>. source is one TSX module. Set export on a route to the name of the export to show there. If export is not set, the default export shows. The props of each component are { params, api }. The module can import only react, @nuclearplayer/ui, and @nuclearplayer/plugin-sdk.',
      params: [{ name: 'view', type: 'RawViewDefinition' }],
      returns: 'void',
    },
    unregister: {
      name: 'unregister',
      description:
        'Removes the view with this id. If the view is open, the dashboard opens.',
      params: [{ name: 'id', type: 'string' }],
      returns: 'void',
    },
  },
};
