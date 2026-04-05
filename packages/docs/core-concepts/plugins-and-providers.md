---
description: What plugins are, what types of providers they offer, and how to manage them
---

# Plugins and providers

Plugins are packages that extend Nuclear with new functionality. Each plugin can register one or more **providers**, which are the actual services Nuclear uses to search, stream, recommend, and display music.

## Provider types

### Metadata

Metadata providers power search. When you type a query in the search box, the active metadata provider returns matching artists, albums, and tracks. It also supplies artist biographies, album tracklists, and related artists when you browse their pages.

Metadata providers declare their capabilities to show you what's available:

**Search capabilities** determine what kinds of results you get:
- `artists`, `albums`, `tracks`, `playlists` (individual search types)
- `unified` (a single search returning all types at once)

**Artist metadata capabilities** determine what you see on artist pages:
- `artistBio`, `artistSocialStats`, `artistTopTracks`, `artistAlbums`, `artistPlaylists`, `artistRelatedArtists`

**Album metadata capabilities**:
- `albumDetails` (tracklist, release date, artwork)

If a provider doesn't declare a capability, Nuclear won't show the corresponding section in the UI. For example, an artist page won't display a biography section if the active metadata provider doesn't support `artistBio`.

### Streaming

Streaming providers deliver audio. When you play a track, the active streaming provider takes the track's title and artist, finds a matching audio stream, and sends it to the playback engine.

### Dashboard

Dashboard providers populate the home screen with content like top tracks, new releases, top artists, and editorial playlists. Multiple dashboard providers can be active at the same time, and each one adds its own sections to the Dashboard.

### Discovery

Discovery providers generate recommendations based on your recent listening. When discovery mode is enabled and you reach the end of your queue, Nuclear asks the active discovery provider for more tracks and appends them automatically. See [Music discovery](../misc/discovery.md) for details.

### Playlists

Playlists providers let you import playlists from external services by pasting a URL, or by clicking them on the dashboard. Each playlists provider can handle URLs from a specific source. All installed playlists providers are active at the same time.

## The plugin store

Open Settings and go to the **Plugins** tab to manage your plugins. The **Store** sub-tab lists available plugins from the plugin registry. You can filter by category and search by name.

Clicking **Install** downloads the plugin and activates it immediately. Installed plugins appear in the **Installed** sub-tab, where you can remove them.

## Choosing active providers (Sources)

When you have multiple plugins offering the same provider type, the **Sources** view (accessible from the left sidebar) lets you pick which one is active.

Sources are split into two groups:

**Selectable** (you pick one from a dropdown):
- Metadata
- Streaming
- Discovery

**Informational** (all installed providers are active):
- Dashboard
- Playlists

### Provider pairing

Some metadata providers are designed to be paired with a specific streaming provider. When you select a paired metadata provider, the streaming dropdown switches to the matching provider and becomes locked. A message explains the pairing.

If the required streaming provider isn't installed, a warning appears on the metadata provider option in the dropdown.
