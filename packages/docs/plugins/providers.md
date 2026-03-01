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
| `'lyrics'` | Song lyrics *(planned)* | N/A |

## Registration

Register providers in your plugin's `onEnable` hook and unregister them in `onDisable`:

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

`register()` returns the provider's ID, which you pass to `unregister()` later.

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
