---
description: Resolve audio streams for tracks in Nuclear's queue.
---

# Streaming

## Streaming API for Plugins

The Streaming API resolves playable audio URLs for tracks. When a user plays a track, Nuclear searches for stream candidates (e.g., YouTube videos) and then resolves the actual audio URL just-in-time.

{% hint style="info" %}
Access streaming via `api.Streaming.*` in your plugin's lifecycle hooks.
{% endhint %}

---

## Core concepts

### Two-phase resolution

Stream resolution happens in two phases:

1. **Candidate discovery** — Search for potential sources (e.g., YouTube videos matching the track)
2. **Stream resolution** — Extract the actual audio URL from the top candidate

Nuclear uses the streaming provider selected by the user in the Sources view. If no streaming provider is active, resolution returns an error.

### Stream candidates

A candidate represents a potential audio source before the URL is resolved. Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for this candidate |
| `title` | `string` | Display title (e.g., video title) |
| `durationMs` | `number?` | Duration in milliseconds |
| `thumbnail` | `string?` | Preview image URL |
| `source` | `ProviderRef` | Which streaming provider found this |
| `stream` | `Stream?` | Resolved audio URL (populated after resolution) |
| `lastResolvedAtIso` | `string?` | When the stream was last resolved, so we know when to refresh it |
| `failed` | `boolean` | True if resolution failed permanently |

{% hint style="info" %}
See `StreamCandidate` in `@nuclearplayer/model` for the full type definition.
{% endhint %}

### Streams

A resolved stream contains the actual playable URL. Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | The audio URL |
| `protocol` | `'file' \| 'http' \| 'https' \| 'hls'` | Stream protocol |
| `mimeType` | `string?` | e.g., `'audio/webm'` |
| `bitrateKbps` | `number?` | Audio quality |
| `codec` | `string?` | e.g., `'opus'`, `'aac'` |
| `qualityLabel` | `string?` | e.g., `'320kbps'`, `'FLAC'` |

{% hint style="info" %}
See `Stream` in `@nuclearplayer/model` for the full type definition.
{% endhint %}

### Stream expiry

Audio URLs from services like YouTube typically expire after a period (often as short as a few hours). Nuclear automatically re-resolves expired streams when needed. The expiry window is configurable via the `playback.streamExpiryMs` setting.

---

## Usage

### Finding candidates

Call `resolveCandidatesForTrack(track)` with a `Track` object containing at least a title and artist. The method returns a result object with `success`, `candidates` (on success), or `error` (on failure).

### Resolving a stream

Once we have a candidate, Nuclear calls `resolveStreamForCandidate(candidate)` to get the actual audio URL. The method returns an updated candidate with the `stream` field populated, or the same candidate if already resolved/failed. This happens when we try to play the track.

---

## Reference

| Method | Description |
|--------|-------------|
| `resolveCandidatesForTrack(track)` | Search for stream candidates matching a track. Returns `StreamResolutionResult`. |
| `resolveStreamForCandidate(candidate)` | Resolve the audio URL for a candidate. Returns updated `StreamCandidate` or `undefined`. The candidate is not mutated, a fresh copy is returned. |

### Resolution behavior

| Input state | Output |
|-------------|--------|
| Candidate with `failed: true` | Returns candidate unchanged (no retry) |
| Candidate with valid, non-expired `stream` | Returns candidate unchanged (cached) |
| Candidate with expired or missing `stream` | Attempts resolution, returns updated candidate |
| Resolution succeeds | Returns candidate with `stream` populated |
| Resolution fails after retries | Returns candidate with `failed: true` |
| No active streaming provider | Returns `undefined` |

---

## Related settings

These core settings affect stream resolution:

| Setting | Description | Default |
|---------|-------------|---------|
| `playback.streamExpiryMs` | How long before a resolved stream is considered expired | 1 hour |
| `playback.streamResolutionRetries` | How many times to retry before marking as failed | 3 |