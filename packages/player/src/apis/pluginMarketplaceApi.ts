import { z } from 'zod';

import { ApiClient } from './ApiClient';

const PluginCategorySchema = z.enum([
  'streaming',
  'metadata',
  'lyrics',
  'scrobbling',
  'dashboard',
  'playlists',
  'discovery',
  'other',
]);

const MarketplacePluginSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  author: z.string().min(1),
  repo: z.string().regex(/^[^/]+\/[^/]+$/),
  // TODO: Remove category after registry migration to categories
  category: PluginCategorySchema.optional(),
  categories: z.array(PluginCategorySchema).optional(),
  tags: z.array(z.string()).optional(),
  version: z.string().min(1).optional(),
  downloadUrl: z.url().optional(),
  sha256: z.string().optional(),
  addedAt: z.iso.datetime(),
});

const RegistrySchema = z.object({
  $schema: z.string().optional(),
  version: z.number(),
  plugins: z.array(MarketplacePluginSchema),
});

export type MarketplacePlugin = z.infer<typeof MarketplacePluginSchema>;

class PluginRegistryApi extends ApiClient {
  constructor() {
    super('https://cdn.jsdelivr.net/gh/NuclearPlayer/plugin-registry@master');
  }

  async getPlugins(): Promise<MarketplacePlugin[]> {
    const registry = await this.fetch('/plugins.json', RegistrySchema);
    return registry.plugins;
  }
}

export const pluginMarketplaceApi = new PluginRegistryApi();
