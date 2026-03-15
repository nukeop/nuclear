---
description: Build metadata providers that power search, artist pages, and album views in Nuclear.
---

# Metadata

## Metadata Providers

Metadata providers supply Nuclear with information about artists, albums, and tracks. When a user searches for music or opens an artist page, Nuclear delegates to whatever metadata provider is active. Without one, there's nothing to search and nothing to display.

Plugins can either add new providers, or use data from existing providers.

Most plugins will add a new provider. Check out the [Discogs plugin](https://github.com/NuclearPlayer/nuclear-plugin-discogs) for a good reference implementation.

---

## Implementing a provider

### Minimal example

A metadata provider is an object that you register with `api.Providers.register()`. At minimum, it needs an `id`, `kind: 'metadata'`, a `name`, and at least one search method:

```typescript
import type { MetadataProvider, NuclearPlugin, NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

const provider: MetadataProvider = {
  id: 'my-metadata',
  kind: 'metadata',
  name: 'My Metadata Source',

  searchCapabilities: ['artists', 'albums'],

  async searchArtists(params) {
    // Call your API, return ArtistRef[]
  },
  async searchAlbums(params) {
    // Call your API, return AlbumRef[]
  },
};

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Providers.register(provider);
  },
  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister('my-metadata');
  },
};

export default plugin;
```

{% hint style="warning" %}
Always unregister your provider in `onDisable`. If you don't, it stays registered and Nuclear may still route queries to it after the plugin is disabled.
{% endhint %}

### Capabilities

Capabilities tell Nuclear which methods your provider supports. Nuclear will never call a method you haven't declared a capability for.

#### Search capabilities

Declared via `searchCapabilities`. Controls which search methods Nuclear calls:

| Capability | Method called | Returns |
|------------|--------------|---------|
| `'artists'` | `searchArtists(params)` | `ArtistRef[]` |
| `'albums'` | `searchAlbums(params)` | `AlbumRef[]` |
| `'tracks'` | `searchTracks(params)` | `Track[]` |
| `'playlists'` | `searchPlaylists(params)` | `PlaylistRef[]` |
| `'unified'` | `search(params)` | `SearchResults` |

The search params for individual methods (`searchArtists`, `searchAlbums`, etc.) contain `query` and `limit`. For `search` (unified), there's an additional `types` array so you know which categories were requested.

{% hint style="info" %}
Most providers should implement individual search methods (`searchArtists`, `searchAlbums`, etc.). Use `'unified'` only if your API has a single endpoint that returns all types at once.
{% endhint %}

#### Artist metadata capabilities

Declared via `artistMetadataCapabilities`. Controls artist detail pages:

| Capability | Method called | Returns |
|------------|--------------|---------|
| `'artistDetails'` | `fetchArtistDetails(artistId)` | `Artist` |
| `'artistAlbums'` | `fetchArtistAlbums(artistId)` | `AlbumRef[]` |
| `'artistTopTracks'` | `fetchArtistTopTracks(artistId)` | `TrackRef[]` |
| `'artistRelatedArtists'` | `fetchArtistRelatedArtists(artistId)` | `ArtistRef[]` |

#### Album metadata capabilities

Declared via `albumMetadataCapabilities`:

| Capability | Method called | Returns |
|------------|--------------|---------|
| `'albumDetails'` | `fetchAlbumDetails(albumId)` | `Album` |

You don't have to support everything. Declare only what your source can provide. Nuclear adapts the UI based on what's available - for example, if you don't declare `'artistTopTracks'`, the top tracks section won't appear on artist pages.

### Streaming provider pairing

If your metadata provider only works with a specific streaming provider (e.g. both come from the same plugin and the same service), declare this with `streamingProviderId`:

```typescript
const provider: MetadataProvider = {
  id: 'my-metadata',
  kind: 'metadata',
  name: 'My Source',
  streamingProviderId: 'my-streaming',
  // ...
};
```

When the user selects this metadata provider in the Sources view, the streaming provider is locked to the one you specified. If the required streaming provider isn't installed, the Sources view shows a warning.

Only set this when the pairing is a hard requirement. If your metadata provider works with any streaming provider, leave it out.

---

## Return types

Your provider methods must return objects matching types from `@nuclearplayer/model` (also exported from `@nuclearplayer/plugin-sdk`). Every entity has a `source` field (`ProviderRef`) that identifies where it came from.

## Thumbnails and artwork

Nuclear picks the best artwork for each context. These include thumbnails, cover art, background images, or artist profile pictures. Provide multiple sizes when you can.

### ProviderRef

Every entity needs a `source` that ties it back to your provider. This is how Nuclear navigates between search results and detail pages.

```typescript
type ProviderRef = {
  provider: string;  // Must match your provider's id
  id: string;        // Your provider's identifier for this entity
  url?: string;      // Optional link to the source page
};
```


#### Compound IDs

The `id` can be anything your provider understands. You'll receive it back in `fetchArtistDetails(id)`, `fetchAlbumDetails(id)`, etc.

Example: The Discogs plugin uses compound IDs like `master:12345` to encode both the release type (release/master) and ID in a single string.

---

## Using metadata

Plugins can also query the active metadata provider. Use `api.Metadata.*` to search and fetch details without knowing which provider is registered.

```typescript
export default {
  async onEnable(api: NuclearPluginAPI) {
    const results = await api.Metadata.search({
      query: 'Radiohead',
      types: ['artists', 'albums'],
      limit: 10,
    });

    if (results.artists?.length) {
      const artistId = results.artists[0].source.id;
      const providerId = results.artists[0].source.provider;

      // Fetch full details (routes to the same provider that returned the search result)
      const artist = await api.Metadata.fetchArtistDetails(artistId, providerId);
      const albums = await api.Metadata.fetchArtistAlbums(artistId, providerId);
    }
  },
};
```

### Consumer reference

```typescript
api.Metadata.search(params: SearchParams, providerId?: string): Promise<SearchResults>
api.Metadata.fetchArtistDetails(artistId: string, providerId?: string): Promise<Artist>
api.Metadata.fetchArtistAlbums(artistId: string, providerId?: string): Promise<AlbumRef[]>
api.Metadata.fetchArtistTopTracks(artistId: string, providerId?: string): Promise<TrackRef[]>
api.Metadata.fetchArtistRelatedArtists(artistId: string, providerId?: string): Promise<ArtistRef[]>
api.Metadata.fetchAlbumDetails(albumId: string, providerId?: string): Promise<Album>
```

All methods accept an optional `providerId`. If omitted, Nuclear uses the first registered metadata provider.

{% hint style="warning" %}
The `artistId` and `albumId` values are provider-specific. Always pass the `providerId` from the same `ProviderRef` that gave you the ID. Mixing IDs from one provider with a different `providerId` will produce errors or wrong results.
{% endhint %}
