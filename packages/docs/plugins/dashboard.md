---
description: "Supply dashboard content: top tracks, trending artists, curated playlists, and more."
---

# Dashboard

## Dashboard Providers

Dashboard providers supply Nuclear's home screen with content like charts, trending artists, new releases, and curated playlists. When you open the player, Nuclear calls each registered dashboard provider and assembles the results into an overview. Without a dashboard provider, the dashboard shows an empty state prompting the user to enable a plugin.

Plugins can either add a new dashboard provider, or consume dashboard data from existing providers.

---

## Implementing a provider

### Minimal example

You register dashboard providers with `api.Providers.register()` just like any other provider. It needs an `id`, `kind: 'dashboard'`, a `name`, and a list of `capabilities` declaring which content it can supply. `metadataProviderId` is optional but recommended:

```typescript
import type { DashboardProvider, NuclearPlugin, NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

const provider: DashboardProvider = {
  id: 'acme-dashboard',
  kind: 'dashboard',
  name: 'Acme Music',

  metadataProviderId: 'acme-metadata',
  capabilities: ['topTracks', 'newReleases'],

  async fetchTopTracks() {
    // Call your API, return Track[]
  },
  async fetchNewReleases() {
    // Call your API, return AlbumRef[]
  },
};

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Providers.register(provider);
  },
  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister('acme-dashboard');
  },
};

export default plugin;
```

{% hint style="warning" %}
Always unregister your provider in `onDisable`. If you don't, it stays registered and Nuclear will keep calling it after the plugin is disabled.
{% endhint %}

### Capabilities

Capabilities tell Nuclear which content your provider can fetch. Nuclear only calls methods for capabilities you declare. If you don't list `'topArtists'`, `fetchTopArtists` is never called even if you define it.

| Capability | Method called | Returns | Widget |
|------------|--------------|---------|--------|
| `'topTracks'` | `fetchTopTracks()` | `Track[]` | Track table with playback controls |
| `'topArtists'` | `fetchTopArtists()` | `ArtistRef[]` | Artist card row |
| `'topAlbums'` | `fetchTopAlbums()` | `AlbumRef[]` | Album card row |
| `'editorialPlaylists'` | `fetchEditorialPlaylists()` | `PlaylistRef[]` | Playlist card row |
| `'newReleases'` | `fetchNewReleases()` | `AlbumRef[]` | Album card row |

{% hint style="info" %}
Nuclear only calls methods for declared capabilities. Declare only the ones you actually implement.
{% endhint %}

Note that `fetchTopTracks` returns full `Track[]` objects, not `TrackRef[]`. The dashboard track table needs complete track data (title, artist, duration, thumbnail) to render without additional lookups.

---

## The `metadataProviderId` field

`metadataProviderId` is optional. It tells Nuclear which metadata provider can look up the entities your dashboard returns.

When a user clicks an artist or album on the dashboard, Nuclear navigates to a detail page. It needs to know which metadata provider can fetch that entity's full details, that's what `metadataProviderId` is for. If you omit it, clicking an artist or album sends the user to the search view instead of the detail page. If you set it to a provider that doesn't exist or can't resolve your IDs, artist and album links from the dashboard will fail.

Typically, your plugin registers both a metadata provider and a dashboard provider, and they share the same underlying API. Point `metadataProviderId` at your metadata provider's `id`.

---

## Attributed results

When multiple dashboard providers are registered, Nuclear will render results from all of them. The API wraps each provider's data in an `AttributedResult<T>`:

```typescript
type AttributedResult<T> = {
  providerId: string;
  metadataProviderId?: string;
  providerName: string;
  items: T[];
};
```

Each attributed result carries the provider's name and IDs, so Nuclear can render labeled sections (e.g. "Top Tracks - Acme Music") and route navigation to the correct metadata provider.

---

## Using dashboard data

Plugins can consume dashboard data from all registered providers via `api.Dashboard.*`:

```typescript
export default {
  async onEnable(api: NuclearPluginAPI) {
    const topTracks = await api.Dashboard.fetchTopTracks();

    for (const result of topTracks) {
      console.log(`${result.providerName}: ${result.items.length} tracks`);
    }
  },
};
```

### Consumer reference

```typescript
api.Dashboard.fetchTopTracks(providerId?: string): Promise<AttributedResult<Track>[]>
api.Dashboard.fetchTopArtists(providerId?: string): Promise<AttributedResult<ArtistRef>[]>
api.Dashboard.fetchTopAlbums(providerId?: string): Promise<AttributedResult<AlbumRef>[]>
api.Dashboard.fetchEditorialPlaylists(providerId?: string): Promise<AttributedResult<PlaylistRef>[]>
api.Dashboard.fetchNewReleases(providerId?: string): Promise<AttributedResult<AlbumRef>[]>
```

All methods accept an optional `providerId`. If omitted, Nuclear queries all registered dashboard providers and returns an array with one `AttributedResult` per provider. If provided, only that provider is queried.

---