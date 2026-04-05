---
description: The big picture of how Nuclear is structured and why it works differently from other music players
---

# How Nuclear works

Nuclear is a player framework that lets you listen to music from multiple sources, and where plugins provide all the content. The player itself handles the interface, playback engine, queue, playlists, and favorites. Everything else comes from plugins you choose to install.

## The plugin model

A fresh Nuclear install comes without any plugins installed. To start playing music, you need to choose your music sources by installing plugins from the store. When you install plugins, they register **providers** that give Nuclear specific capabilities:

- A **metadata provider** lets you search for artists, albums, and tracks, and browse their details
- A **streaming provider** finds and delivers the actual audio when you play a track
- A **dashboard provider** populates the home screen with top tracks, new releases, and recommendations
- A **discovery provider** generates track recommendations based on what you're listening to
- A **playlists provider** lets you import playlists from external services by URL

Some plugins register a single provider type. Others register several at once, giving you metadata and streaming from the same source.

You can install as many plugins as you want. When multiple plugins offer the same type of provider, you pick which one is active in the **Sources** view.

Some providers can all be active at the same time. For example playlist providers don't interfere with each other and simply let you import playlists from multiple sources.

## How playback works

When you add a track to the queue and press play, two providers work together:

1. The active **metadata provider** supplied the track information (title, artist, album, artwork) when you searched for it
2. The active **streaming provider** takes that information and finds an audio stream to play

The player handles everything from there: buffering, seeking, volume, and moving through the queue.

{% hint style="info" %}
Some metadata providers are paired with a specific streaming provider. When you select one of these, Nuclear automatically switches to the matching streaming provider and locks the selection. This happens because the metadata and audio come from the same source and can't be mixed with other providers.
{% endhint %}

## What the player manages

While plugins handle content, the player itself owns:

- **The queue**: your current listening session. Add tracks, reorder them, shuffle, repeat. The queue persists across restarts.
- **Favorites**: save tracks, albums, and artists to your favorites.
- **Playlists**: create and manage playlists. Import and export them as JSON files, or from other services via plugins.
- **Settings**: audio configuration, appearance, key shortcuts, update preferences.
- **Themes**: change how Nuclear looks without affecting functionality. Choose from built-in themes, create yours, or install community themes from the theme store.
- **Plugins**: install, update, and manage plugins that provide sources and expand Nuclear's functionalities.