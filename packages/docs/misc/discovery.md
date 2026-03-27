---
description: Automatic track recommendations
---

# Music discovery

Discovery recommends tracks based on what you're listening to and adds them to your queue automatically. When you reach the last track in your queue, Nuclear uses discovery providers to add more music.

## How it works

Discovery watches your queue position. When you're playing the last track, it sends the last 10 tracks in your queue to a discovery provider (added by plugins). The provider returns recommendations, and Nuclear adds them to the end of your queue.

## Requirements

- At least one plugin with a discovery provider installed
- Discovery toggled on via the player bar button (boombox icon)
- Tracks in your queue (discovery uses recent tracks as context for recommendations)

## Enabling discovery

1. Look for the boombox icon button in the player bar at the bottom of the screen, after the repeat button
2. Click it to toggle discovery on or off
3. The button tooltip shows the current state: "Discovery: on" or "Discovery: off"

If you don't see the boombox button, you don't have a plugin installed that provides discovery. Install one from the plugin store.

## Choosing a discovery source

1. Open the Sources view from the sidebar
2. Find the Discovery section, which lists all available discovery providers from your installed plugins
3. Select the provider you want to use

## Variety slider

The variety slider controls how far recommendations stray from your current listening.

To adjust it, go to **Preferences -> General -> Playback** and move the **Discovery variety** slider.
