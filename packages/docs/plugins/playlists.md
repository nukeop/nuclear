---
description: Create, modify, and import playlists, organize them into folders, or register a provider that fetches playlists from URLs.
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

### Folders

Users can put playlists into folders. A folder can contain playlists only. A folder cannot contain other folders.

There are two methods that read the index:

- `getIndex()` returns a flat list of all playlists in display order. The list includes the playlists in folders. Use this method when you do not use folders.
- `getIndexTree()` returns the top level of the index in display order. Each item is a playlist or a folder. Use the `kind` field to identify the item. A folder contains its playlists in the `playlists` field, in display order.

`createPlaylist` and `importPlaylist` add the new playlist to the end of the top level. To move a playlist into a folder, use `movePlaylistToFolder`. All other playlist methods operate the same on playlists in folders.

The listener of `subscribe` receives the same flat list as `getIndex()`. Nuclear also calls the listener when only the folders change. To get the folders, call `getIndexTree()` in the listener.

If a folder ID or a playlist ID does not exist, the folder methods throw an error.

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

Each playlist is stored as a separate JSON file on disk. The index stores the folders and the order of playlists and folders. All mutations through the API persist automatically.

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

{% tab title="Folders" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Create a folder and move a playlist into it
    const folderId = await api.Playlists.createFolder('Workouts');
    const playlistId = await api.Playlists.createPlaylist('Leg day');
    await api.Playlists.movePlaylistToFolder(playlistId, folderId);

    // Save the queue as a playlist in the folder
    await api.Playlists.saveQueueAsPlaylist('Cardio', folderId);

    // Read the playlists and folders in display order
    const tree = await api.Playlists.getIndexTree();
    for (const node of tree) {
      if (node.kind === 'folder') {
        api.Logger.info(`${node.name}: ${node.playlists.length} playlists`);
      } else {
        api.Logger.info(node.name);
      }
    }

    // Move the playlist to the top level
    await api.Playlists.movePlaylistToFolder(playlistId);

    await api.Playlists.renameFolder(folderId, 'Training');

    // Delete the folder. Its playlists will move to the position of the folder.
    await api.Playlists.deleteFolder(folderId);
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
  kind: 'playlist';
  id: string;
  name: string;
  createdAtIso: string;
  lastModifiedIso: string;
  isReadOnly: boolean;
  artwork?: ArtworkSet;
  itemCount: number;
  totalDurationMs: number;
  thumbnails: string[];
};
```

### PlaylistFolder

```typescript
type PlaylistFolder = {
  kind: 'folder';
  id: string;
  name: string;
  playlists: PlaylistIndexEntry[];  // In display order
};
```

### PlaylistIndexNode

```typescript
type PlaylistIndexNode = PlaylistIndexEntry | PlaylistFolder;
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
api.Playlists.getIndexTree(): Promise<PlaylistIndexNode[]>
api.Playlists.getPlaylist(id: string): Promise<Playlist | null>

// Creating
api.Playlists.createPlaylist(name: string): Promise<string>
api.Playlists.importPlaylist(playlist: Playlist): Promise<string>
api.Playlists.saveQueueAsPlaylist(name: string, folderId?: string | null): Promise<string>

// Folders
api.Playlists.createFolder(name: string): Promise<string>
api.Playlists.renameFolder(id: string, name: string): Promise<void>
api.Playlists.deleteFolder(id: string): Promise<void>
api.Playlists.movePlaylistToFolder(playlistId: string, folderId?: string | null): Promise<void>

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
