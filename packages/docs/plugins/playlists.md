---
description: Create, modify, and import playlists, or register a provider that fetches playlists from URLs.
---

# Playlists

## Playlists API for Plugins

The Playlists API has two sides. The **consumer API** (`api.Playlists.*`) lets plugins create, read, modify, and import playlists. The **provider type** (`PlaylistProvider`) lets plugins register a handler that fetches playlists from URLs (Spotify links, SoundCloud pages, etc.).

{% hint style="info" %}
Access playlists via `api.Playlists.*` in your plugin's lifecycle hooks. All operations are asynchronous and return Promises.
{% endhint %}

---

## Core concepts

### Index vs. full playlist

Nuclear keeps a lightweight **index** of all playlists and loads the full playlist data on demand. This matters for two reasons:

1. `getIndex()` returns `PlaylistIndexEntry[]`, which contains names, timestamps, artwork, and aggregate stats (item count, total duration), but not the actual track list.
2. `getPlaylist(id)` returns the full `Playlist` with its `items` array.

Use the index for listing and displaying playlists. Load the full playlist only when you need the tracks.

### Playlist items

Each track in a playlist is wrapped in a `PlaylistItem`:

```typescript
type PlaylistItem = {
  id: string;          // Unique ID for this item (not the track ID)
  track: Track;        // Full track metadata
  note?: string;       // Optional user note
  addedAtIso: string;  // ISO timestamp
};
```

A single track can appear multiple times in a playlist, each as a separate `PlaylistItem` with its own `id`.

### Persistence

Each playlist is stored as a separate JSON file on disk. All mutations through the API persist automatically.

---

## Usage

{% tabs %}
{% tab title="Reading playlists" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // List all playlists (lightweight, no track data)
    const index = await api.Playlists.getIndex();
    for (const entry of index) {
      api.Logger.info(`${entry.name}: ${entry.itemCount} tracks, ${entry.totalDurationMs}ms`);
    }

    // Load the full playlist when you need track data
    const playlist = await api.Playlists.getPlaylist(index[0].id);
    if (playlist) {
      for (const item of playlist.items) {
        api.Logger.debug(`  ${item.track.title}`);
      }
    }
  },
};
```
{% endtab %}

{% tab title="Creating and modifying" %}
```typescript
import type { NuclearPluginAPI, Track } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Create a new playlist
    const playlistId = await api.Playlists.createPlaylist('Late Night Jazz');

    // Add tracks
    const tracks: Track[] = [
      // ... your track objects
    ];
    const newItems = await api.Playlists.addTracks(playlistId, tracks);
    api.Logger.info(`Added ${newItems.length} items`);

    // Reorder: move the first track to position 3
    // The playlist must be loaded first
    await api.Playlists.getPlaylist(playlistId);
    await api.Playlists.reorderTracks(playlistId, 0, 3);

    // Remove specific items by their item IDs (not track IDs)
    await api.Playlists.removeTracks(playlistId, [newItems[0].id]);

    // Delete the entire playlist
    await api.Playlists.deletePlaylist(playlistId);
  },
};
```
{% endtab %}

{% tab title="Importing" %}
```typescript
import type { NuclearPluginAPI, Playlist } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const externalPlaylist: Playlist = {
      id: 'ignored-original-id',
      name: 'Imported Playlist',
      createdAtIso: new Date().toISOString(),
      lastModifiedIso: new Date().toISOString(),
      isReadOnly: true,
      items: [
        // ... playlist items
      ],
    };

    // importPlaylist always generates a fresh ID
    const newId = await api.Playlists.importPlaylist(externalPlaylist);
    api.Logger.info(`Imported as ${newId}`);

    // The original ID is discarded. Importing the same
    // object again creates a second, independent playlist.

    // Save the current queue as a new playlist
    const queuePlaylistId = await api.Playlists.saveQueueAsPlaylist('Queue Snapshot');
  },
};
```
{% endtab %}

{% tab title="Subscribing to changes" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const unsubscribe = api.Playlists.subscribe((index) => {
      api.Logger.info(`Playlists changed: ${index.length} playlists`);
    });

    // Always clean up
    return () => {
      unsubscribe();
    };
  },
};
```
{% endtab %}
{% endtabs %}

---

## Playlist providers

Plugins can register a `PlaylistProvider` that handles URL-based playlist imports. When a user pastes a URL into Nuclear's import dialog, the player asks each registered playlist provider whether it can handle that URL. The first provider that matches gets called to fetch the playlist.

### Implementing a provider

A playlist provider needs two methods:

* `matchesUrl(url)` returns `true` if this provider can handle the given URL. This is called synchronously and should be fast (a regex test or hostname check, not a network request).
* `fetchPlaylistByUrl(url)` fetches and returns a full `Playlist` from the URL.

Register it with `api.Providers.register()` like any other provider, with `kind: 'playlists'`:

```typescript
import type {
  NuclearPlugin,
  NuclearPluginAPI,
  PlaylistProvider,
  Playlist,
} from '@nuclearplayer/plugin-sdk';

const provider: PlaylistProvider = {
  id: 'acme-playlists',
  kind: 'playlists',
  name: 'Acme Playlists',

  matchesUrl(url: string): boolean {
    return url.includes('acme.music/playlist/');
  },

  async fetchPlaylistByUrl(url: string): Promise<Playlist> {
    const response = await fetch(`https://api.acme.music/resolve?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    return {
      id: data.id,
      name: data.title,
      createdAtIso: new Date().toISOString(),
      lastModifiedIso: new Date().toISOString(),
      isReadOnly: false,
      items: data.tracks.map((track: any) => ({
        id: crypto.randomUUID(),
        track: {
          title: track.name,
          artists: [{ name: track.artist, roles: ['main'] }],
          source: { provider: 'acme', id: track.id },
        },
        addedAtIso: new Date().toISOString(),
      })),
    };
  },
};

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Providers.register(provider);
  },
  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister('acme-playlists');
  },
};

export default plugin;
```

{% hint style="warning" %}
Always unregister your provider in `onDisable`. If you don't, Nuclear will keep calling it after the plugin is disabled.
{% endhint %}

---

## Types

### Playlist

```typescript
type Playlist = {
  id: string;
  name: string;
  description?: string;
  artwork?: ArtworkSet;
  tags?: string[];
  createdAtIso: string;
  lastModifiedIso: string;
  origin?: ProviderRef;       // Where this playlist was imported from
  isReadOnly: boolean;
  parentId?: string;
  items: PlaylistItem[];
};
```

### PlaylistIndexEntry

```typescript
type PlaylistIndexEntry = {
  id: string;
  name: string;
  createdAtIso: string;
  lastModifiedIso: string;
  isReadOnly: boolean;
  artwork?: ArtworkSet;
  itemCount: number;
  totalDurationMs: number;
};
```

### PlaylistItem

```typescript
type PlaylistItem = {
  id: string;
  track: Track;
  note?: string;
  addedAtIso: string;
};
```

---

## Reference

```typescript
// Reading
api.Playlists.getIndex(): Promise<PlaylistIndexEntry[]>
api.Playlists.getPlaylist(id: string): Promise<Playlist | null>

// Creating
api.Playlists.createPlaylist(name: string): Promise<string>
api.Playlists.importPlaylist(playlist: Playlist): Promise<string>
api.Playlists.saveQueueAsPlaylist(name: string): Promise<string>

// Modifying
api.Playlists.addTracks(playlistId: string, tracks: Track[]): Promise<PlaylistItem[]>
api.Playlists.removeTracks(playlistId: string, itemIds: string[]): Promise<void>
api.Playlists.reorderTracks(playlistId: string, from: number, to: number): Promise<void>

// Deleting
api.Playlists.deletePlaylist(id: string): Promise<void>

// Subscriptions
api.Playlists.subscribe(listener: (index: PlaylistIndexEntry[]) => void): () => void
```

### Provider type

```typescript
type PlaylistProvider = ProviderDescriptor<'playlists'> & {
  matchesUrl: (url: string) => boolean;
  fetchPlaylistByUrl: (url: string) => Promise<Playlist>;
};
```