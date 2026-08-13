---
description: Search YouTube and resolve audio stream URLs via yt-dlp.
---

# yt-dlp

## yt-dlp API for Plugins

The yt-dlp API gives plugins access to the [yt-dlp](https://github.com/yt-dlp/yt-dlp) command-line tool for searching YouTube and resolving direct audio stream URLs.

Unless you want your plugin to integrate with Youtube, you probably won't need this API at all.

{% hint style="warning" %}
yt-dlp is a system dependency. If it's not installed on the user's machine, this API won't be available. Always check `api.Ytdlp.available` before calling any methods.
{% endhint %}

---

## Availability

The yt-dlp host is only configured when Nuclear detects a working yt-dlp binary on the system. The `available` getter tells you whether you can use the API:

```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    if (!api.Ytdlp.available) {
      api.Logger.warn('yt-dlp is not installed, skipping YouTube features');
      return;
    }

    // Safe to call search() and getStream() here
  },
};
```

If you call `search()` or `getStream()` without a configured host, they throw `Error('YtdlpAPI: No host configured')`.

---

## Usage

{% tabs %}
{% tab title="Searching" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    if (!api.Ytdlp.available) return;

    const results = await api.Ytdlp.search('Radiohead Paranoid Android', 5);

    for (const result of results) {
      api.Logger.info(`${result.title} (${result.id})`);

      if (result.duration) {
        api.Logger.info(`Duration: ${result.duration}s`);
      }
    }
  },
};
```
{% endtab %}

{% tab title="Getting streams" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    if (!api.Ytdlp.available) return;

    const results = await api.Ytdlp.search('Radiohead Paranoid Android', 1);
    if (results.length === 0) return;

    const stream = await api.Ytdlp.getStream(results[0].id);
    api.Logger.info(`Stream URL: ${stream.stream_url}`);
  },
};
```
{% endtab %}
{% endtabs %}

---

## Data types

### `YtdlpSearchResult`

Returned by `search()`. Represents a YouTube video matching the query.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | YouTube video ID |
| `title` | `string` | Video title |
| `duration` | `number \| null` | Duration in seconds, or `null` if unknown |
| `thumbnail` | `string \| null` | Thumbnail URL, or `null` if unavailable |
| `channel` | `string \| null` | Uploading channel name, or `null` if unknown |

### `YtdlpStreamInfo`

Returned by `getStream()`. Contains the resolved audio stream URL.

| Field | Type | Description |
|-------|------|-------------|
| `stream_url` | `string` | Direct audio stream URL |
| `duration` | `number \| null` | Duration in seconds |
| `title` | `string \| null` | Video title |
| `container` | `string \| null` | Container format, e.g. `'webm'` |
| `codec` | `string \| null` | Audio codec, e.g. `'opus'` |

### `YtdlpPlaylistInfo`

Returned by `getPlaylist()`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Playlist ID |
| `title` | `string` | Playlist title |
| `entries` | `YtdlpPlaylistEntry[]` | The playlist's videos, in order |

### `YtdlpPlaylistEntry`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Video ID |
| `title` | `string` | Video title |
| `duration` | `number \| null` | Duration in seconds |
| `thumbnails` | `YtdlpThumbnail[]` | Available thumbnails, may be empty |
| `channel` | `string \| null` | Uploading channel name |

### `YtdlpThumbnail`

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | Thumbnail URL |
| `width` | `number \| null` | Width in pixels |
| `height` | `number \| null` | Height in pixels |

{% hint style="info" %}
These types mirror the Rust types in `packages/player/src-tauri/src/ytdlp.rs`.
{% endhint %}

---

## Reference

```typescript
// Availability
api.Ytdlp.available: boolean

// Search YouTube for videos
api.Ytdlp.search(query: string, maxResults?: number): Promise<YtdlpSearchResult[]>

// Resolve a video ID to a playable stream URL
api.Ytdlp.getStream(videoId: string): Promise<YtdlpStreamInfo>

// Read a playlist's entries from its URL
api.Ytdlp.getPlaylist(url: string): Promise<YtdlpPlaylistInfo>
```

---

## Stream expiry

Audio stream URLs from YouTube are ephemeral. They expire after a few hours. Don't store them for later use. Resolve a fresh URL each time you need to play a track.

{% hint style="info" %}
This API is primarily used by streaming providers. Most plugins won't need it.
{% endhint %}
