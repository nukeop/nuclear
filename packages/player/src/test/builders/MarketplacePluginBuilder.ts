import { type MarketplacePlugin } from '../../apis/pluginMarketplaceApi';

export class MarketplacePluginBuilder {
  private plugin: MarketplacePlugin = {
    id: 'default-plugin',
    name: 'Default Plugin',
    description: 'A default plugin',
    author: 'tester',
    repo: 'tester/default-plugin',
    sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    addedAt: '2026-01-01T00:00:00.000Z',
  };

  withId(id: string): MarketplacePluginBuilder {
    this.plugin.id = id;
    this.plugin.repo = `tester/${id}`;
    return this;
  }

  withName(name: string): MarketplacePluginBuilder {
    this.plugin.name = name;
    return this;
  }

  withDescription(description: string): MarketplacePluginBuilder {
    this.plugin.description = description;
    return this;
  }

  withAuthor(author: string): MarketplacePluginBuilder {
    this.plugin.author = author;
    return this;
  }

  withRepo(repo: string): MarketplacePluginBuilder {
    this.plugin.repo = repo;
    return this;
  }

  withVersion(version: string): MarketplacePluginBuilder {
    this.plugin.version = version;
    return this;
  }

  withDownloadUrl(downloadUrl: string): MarketplacePluginBuilder {
    this.plugin.downloadUrl = downloadUrl;
    return this;
  }

  withoutSha256(): MarketplacePluginBuilder {
    delete this.plugin.sha256;
    return this;
  }

  withCategories(categories: string[]): MarketplacePluginBuilder {
    this.plugin.categories = categories;
    return this;
  }

  build(): MarketplacePlugin {
    return { ...this.plugin };
  }
}
