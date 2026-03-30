import { z } from 'zod';

import { ApiClient } from './ApiClient';

const MarketplacePluginSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  author: z.string().min(1),
  repo: z.string().regex(/^[^/]+\/[^/]+$/),
  category: z.enum([
    'streaming',
    'metadata',
    'lyrics',
    'scrobbling',
    'dashboard',
    'other',
  ]),
  tags: z.array(z.string()).optional(),
  addedAt: z.string().datetime(),
});

const RegistrySchema = z.object({
  $schema: z.string().optional(),
  version: z.number(),
  plugins: z.array(MarketplacePluginSchema),
});

const GitHubReleaseSchema = z.object({
  tag_name: z.string(),
  name: z.string(),
  published_at: z.string(),
  assets: z.array(
    z.object({
      name: z.string(),
      browser_download_url: z.string().url(),
      size: z.number(),
    }),
  ),
});

export type MarketplacePlugin = z.infer<typeof MarketplacePluginSchema>;

export type PluginRelease = {
  version: string;
  name: string;
  publishedAt: string;
  downloadUrl: string;
  size: number;
};

const PLUGIN_ASSET_NAME = 'plugin.zip';

class PluginRegistryApi extends ApiClient {
  constructor() {
    super('https://cdn.jsdelivr.net/gh/NuclearPlayer/plugin-registry@master');
  }

  async getPlugins(): Promise<MarketplacePlugin[]> {
    const registry = await this.fetch('/plugins.json', RegistrySchema);
    return registry.plugins;
  }
}

class GitHubReleasesApi extends ApiClient {
  constructor() {
    super('https://api.github.com');
  }

  async getLatestRelease(repo: string): Promise<PluginRelease> {
    if (!/^[^/]+\/[^/]+$/.test(repo)) {
      throw new Error(`Invalid repo format: ${repo}`);
    }

    const release = await this.fetch(
      `/repos/${repo}/releases/latest`,
      GitHubReleaseSchema,
    );

    const asset = release.assets.find((a) => a.name === PLUGIN_ASSET_NAME);
    if (!asset) {
      throw new Error(`No ${PLUGIN_ASSET_NAME} in release for ${repo}`);
    }

    return {
      version: release.tag_name.replace(/^v/i, ''),
      name: release.name,
      publishedAt: release.published_at,
      downloadUrl: asset.browser_download_url,
      size: asset.size,
    };
  }
}

class PluginMarketplaceApi {
  private registry = new PluginRegistryApi();
  private releases = new GitHubReleasesApi();

  getPlugins() {
    return this.registry.getPlugins();
  }

  getLatestRelease(repo: string) {
    return this.releases.getLatestRelease(repo);
  }
}

export const pluginMarketplaceApi = new PluginMarketplaceApi();
