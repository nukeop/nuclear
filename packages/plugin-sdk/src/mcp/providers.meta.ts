import type { DomainMeta } from './meta';

export const ProvidersAPIMeta: DomainMeta = {
  description:
    'Query registered music providers (metadata, streaming, dashboard, etc.).',
  methods: {
    list: {
      name: 'list',
      description:
        'List all registered providers, optionally filtered by kind (metadata, streaming, lyrics, dashboard).',
      params: [{ name: 'kind', type: 'string?' }],
      returns: 'ProviderDescriptor[]',
    },
    get: {
      name: 'get',
      description: 'Get a specific provider by ID and kind.',
      params: [
        { name: 'id', type: 'string' },
        { name: 'kind', type: 'string' },
      ],
      returns: 'ProviderDescriptor | undefined',
    },
  },
};
