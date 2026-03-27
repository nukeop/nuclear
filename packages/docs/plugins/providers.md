---
description: Register providers that supply metadata, audio streams, dashboard content, and more to Nuclear.
---

# Providers

## Providers API for Plugins

Providers are modules that fulfill specific data requests from Nuclear. When the player needs to search for tracks, stream audio, or populate the dashboard, it queries the providers for that kind of request. Different provider kinds serve different purposes, and plugins can register as many providers as they need.

All registration and lookup goes through `api.Providers`.

{% hint style="info" %}
Every provider extends the `ProviderDescriptor` base type, which requires an `id`, `kind`, and `name`. Each provider kind then adds its own domain-specific methods (e.g., `searchArtists` for metadata, `getStreamUrl` for streaming).
{% endhint %}

## Provider kinds

| Kind | Purpose | Guide |
|------|---------|-------|
| `'metadata'` | Search results, artist & album details | [Metadata](metadata.md) |
| `'streaming'` | Audio stream URLs for playback | [Streaming](streaming.md) |
| `'dashboard'` | Dashboard content (top tracks, new releases, etc.) | [Dashboard](dashboard.md) |
| `'playlists'` | Fetch playlists from URLs (Spotify, SoundCloud, etc.) | [Playlists](playlists.md) |
| `'discovery'` | Track recommendations | [Discovery](discovery.md) |
| `'lyrics'` | Song lyrics *(planned)* | N/A |

## Registration

Register providers in your plugin's `onEnable` hook and unregister them in `onDisable`:

{% tabs %}
{% tab title="Registering a provider" %}
```typescript
import type { NuclearPluginAPI, MetadataProvider } from '@nuclearplayer/plugin-sdk';

let providerId: string;

export default {
  onEnable(api: NuclearPluginAPI) {
    const provider: MetadataProvider = {
      id: 'my-metadata-source',
      kind: 'metadata',
      name: 'My Metadata Source',
      searchCapabilities: ['artists', 'albums'],
      searchArtists: async (params) => { /* ... */ },
      searchAlbums: async (params) => { /* ... */ },
      fetchAlbumDetails: async (albumId) => { /* ... */ },
    };

    providerId = api.Providers.register(provider);
  },

  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister(providerId);
  },
};
```
{% endtab %}

{% tab title="Querying providers" %}
```typescript
import type { NuclearPluginAPI, MetadataProvider } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // List all metadata providers
    const metadataProviders = api.Providers.list('metadata');
    console.log(`Found ${metadataProviders.length} metadata providers`);

    // Get a specific provider by ID
    const provider = api.Providers.get<MetadataProvider>(
      'my-metadata-source',
      'metadata',
    );

    // React to provider changes
    const unsubscribe = api.Providers.subscribe(() => {
      console.log('Providers changed');
    });

    return () => {
      unsubscribe();
    };
  },
};
```
{% endtab %}
{% endtabs %}

`register()` returns the provider's ID, which you pass to `unregister()` later. The first provider registered for a given kind becomes the active provider automatically. If the user hasn't changed the selection in Sources, subsequent registrations don't override it.

## Provider lifecycle

Always register in `onEnable` and unregister in `onDisable`. If you skip unregistration, the provider stays in Nuclear's registry after your plugin is disabled, and the player may still pass queries to that phantom provider.

| Hook | Action |
|------|--------|
| `onEnable` | `api.Providers.register(provider)` |
| `onDisable` | `api.Providers.unregister(providerId)` |

## Base type

All providers share this shape:

```typescript
type ProviderDescriptor<K extends ProviderKind = ProviderKind> = {
  id: string;
  kind: K;
  name: string;
  pluginId?: string;
};
```

Each provider kind (e.g., `MetadataProvider`, `StreamingProvider`, `DashboardProvider`) extends `ProviderDescriptor` with its own methods. See the individual guides linked above for details.

## Sources view

Users manage providers in the Sources view, accessible from the sidebar. Metadata and streaming providers have an **active selection** that determines which provider handles search queries and stream resolution. The first provider registered for a kind becomes the active one automatically, and the selection persists across restarts. Users can switch the active provider at any time in the Sources view.

When you register a new provider kind, it appears in the Sources view automatically.

## Reference

```typescript
// Registration
api.Providers.register<T extends ProviderDescriptor>(provider: T): string
api.Providers.unregister(id: string): boolean

// Querying
api.Providers.list<K extends ProviderKind>(kind?: K): ProviderDescriptor<K>[]
api.Providers.get<T extends ProviderDescriptor>(id: string | undefined, kind: ProviderKind): T | undefined

// Subscriptions
api.Providers.subscribe(listener: () => void): () => void
```
