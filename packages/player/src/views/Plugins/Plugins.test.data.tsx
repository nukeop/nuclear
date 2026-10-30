import { MarketplacePlugin } from '../../apis/pluginMarketplaceApi';

export const fakePluginManifest = JSON.stringify({
  name: 'nuclear-fake-plugin',
  version: '0.1.0',
  description: 'Fake plugin for testing',
  main: 'index.ts',
  license: 'AGPL-3.0-only',
  author: 'nukeop',
  keywords: ['nuclear', 'test'],
  nuclear: {
    displayName: 'Fake plugin',
    category: 'Robbing ships on the high seas',
    icon: {
      type: 'link',
      link: 'https://example.com/icon.png',
    },
    permissions: [],
  },
});

export const fakeMarketplacePlugins: MarketplacePlugin[] = [
  {
    id: 'nuclear-youtube-plugin',
    name: 'YouTube Music',
    description: 'Stream music from YouTube',
    author: 'nukeop',
    repo: 'NuclearPlayer/nuclear-youtube-plugin',
    category: 'streaming',
    addedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'nuclear-lastfm-plugin',
    name: 'Last.fm Scrobbler',
    description: 'Scrobble your listening history to Last.fm',
    author: 'nukeop',
    repo: 'NuclearPlayer/nuclear-lastfm-plugin',
    category: 'scrobbling',
    addedAt: '2026-02-20T00:00:00Z',
  },
  {
    id: 'nuclear-musicbrainz-plugin',
    name: 'MusicBrainz Metadata',
    description: 'Fetch metadata from MusicBrainz database',
    author: 'nukeop',
    repo: 'NuclearPlayer/nuclear-musicbrainz-plugin',
    category: 'metadata',
    addedAt: '2026-03-10T00:00:00Z',
  },
];

export const fakeInstallableYouTubePlugin: MarketplacePlugin = {
  ...fakeMarketplacePlugins[0],
  version: '1.0.0',
  downloadUrl:
    'https://github.com/NuclearPlayer/nuclear-youtube-plugin/releases/download/v1.0.0/plugin.zip',
  sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
};

export const fakeYouTubePluginManifest = JSON.stringify({
  name: 'nuclear-youtube-plugin',
  version: '1.0.0',
  description: 'Stream music from YouTube',
  main: 'index.ts',
  license: 'AGPL-3.0-only',
  author: 'nukeop',
  keywords: ['nuclear', 'youtube'],
  nuclear: {
    displayName: 'YouTube Music',
    category: 'streaming',
    icon: { type: 'link', link: 'https://example.com/youtube-icon.png' },
    permissions: [],
  },
});
