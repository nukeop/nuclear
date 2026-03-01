---
description: Save and manage user's favorite tracks, albums, and artists.
---

# Favorites

## Favorites API for Plugins

The Favorites API lets Nuclear, as well as  plugins, read and modify the user's library of saved tracks, albums, and artists.

{% hint style="info" %}
Access favorites via `api.Favorites.*` in your plugin's lifecycle hooks. All operations are asynchronous and return Promises.
{% endhint %}

---

## Core concepts

### What gets stored

Nuclear stores three types of favorites:

| Type | What's saved  |
|------|--------------|
| Tracks | Full track metadata  |
| Albums | Album reference |
| Artists | Artist reference |

Each favorite entry includes a timestamp (`addedAtIso`) recording when it was added.

### Identity and deduplication

Favorites are identified by their `source` field. It's a combination of provider name and ID. Because each metadata provider stores music data differently, **favorites from each provider are treated separately**.

```typescript
type ProviderRef = {
  provider: string;  // e.g., "musicbrainz", "lastfm"
  id: string;        // Provider-specific identifier
  url?: string;      // Optional link to the source
};
```

Adding the same track twice (same provider + ID) is a no-op. The original entry and timestamp are preserved.

### Persistence

Favorites are saved to disk automatically after every add/remove operation. They persist across app restarts.

---

## Usage

{% tabs %}
{% tab title="Reading favorites" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const tracks = await api.Favorites.getTracks();
    const albums = await api.Favorites.getAlbums();
    const artists = await api.Favorites.getArtists();

    api.Logger.info(`Library: ${tracks.length} tracks, ${albums.length} albums, ${artists.length} artists`);

    // Each entry has a ref and timestamp
    for (const entry of tracks) {
      api.Logger.debug(`${entry.ref.title} - added ${entry.addedAtIso}`);
    }
  },
};
```
{% endtab %}

{% tab title="Adding favorites" %}
```typescript
import type { NuclearPluginAPI, Track, AlbumRef, ArtistRef } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Add a track (requires full Track object)
    const track: Track = {
      title: 'Paranoid Android',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      source: { provider: 'musicbrainz', id: 'abc123' },
    };
    await api.Favorites.addTrack(track);

    // Add an album (AlbumRef is lighter than full Album)
    const album: AlbumRef = {
      title: 'OK Computer',
      source: { provider: 'musicbrainz', id: 'def456' },
    };
    await api.Favorites.addAlbum(album);

    // Add an artist
    const artist: ArtistRef = {
      name: 'Radiohead',
      source: { provider: 'musicbrainz', id: 'ghi789' },
    };
    await api.Favorites.addArtist(artist);
  },
};
```
{% endtab %}

{% tab title="Removing favorites" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Remove by source reference (provider + ID)
    await api.Favorites.removeTrack({ provider: 'musicbrainz', id: 'abc123' });
    await api.Favorites.removeAlbum({ provider: 'musicbrainz', id: 'def456' });
    await api.Favorites.removeArtist({ provider: 'musicbrainz', id: 'ghi789' });
  },
};
```
{% endtab %}

{% tab title="Checking favorite status" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const source = { provider: 'musicbrainz', id: 'abc123' };

    if (await api.Favorites.isTrackFavorite(source)) {
      api.Logger.info('Track is in favorites');
    }

    // Same pattern for albums and artists
    const isAlbumSaved = await api.Favorites.isAlbumFavorite(source);
    const isArtistSaved = await api.Favorites.isArtistFavorite(source);
  },
};
```
{% endtab %}

{% tab title="Subscribing to changes" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const unsubscribe = api.Favorites.subscribe((favorites) => {
      api.Logger.info(`Favorites updated: ${favorites.tracks.length} tracks`);
      
      // React to changes - sync to external service, update UI, etc.
    });

    // Return cleanup function
    return () => {
      unsubscribe();
    };
  },
};
```
{% endtab %}
{% endtabs %}

---

## Reference

```typescript
// Reading
api.Favorites.getTracks(): Promise<FavoriteEntry<Track>[]>
api.Favorites.getAlbums(): Promise<FavoriteEntry<AlbumRef>[]>
api.Favorites.getArtists(): Promise<FavoriteEntry<ArtistRef>[]>

// Tracks
api.Favorites.addTrack(track: Track): Promise<void>
api.Favorites.removeTrack(source: ProviderRef): Promise<void>
api.Favorites.isTrackFavorite(source: ProviderRef): Promise<boolean>

// Albums
api.Favorites.addAlbum(ref: AlbumRef): Promise<void>
api.Favorites.removeAlbum(source: ProviderRef): Promise<void>
api.Favorites.isAlbumFavorite(source: ProviderRef): Promise<boolean>

// Artists
api.Favorites.addArtist(ref: ArtistRef): Promise<void>
api.Favorites.removeArtist(source: ProviderRef): Promise<void>
api.Favorites.isArtistFavorite(source: ProviderRef): Promise<boolean>

// Subscriptions
api.Favorites.subscribe(listener: FavoritesListener): () => void
```
