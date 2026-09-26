---
description: How to run Nuclear with a clean, independent set of user data.
---

# Profiles

Profiles are a feature that work exactly like browser profiles. Each one has its own settings, favorites, playlists, plugins, themes, history, logs, and other data. You can use profiles when sharing the same computer with another person.

## How to use it

Start Nuclear with `--profile <name>` to use a profile. The profile's name can only contain letters, digits, hyphens, and underscores. Without that argument, Nuclear uses the default profile as usual.

## Dev mode

In dev mode, the profile's name needs to be passed to the app like this: `pnpm dev -- -- -- --profile demo`.

## Where profiles are stored

Profile adds a suffix to Nuclear's app identifier, which is normally `com.nuclearplayer`. A profile adds its name to the end and it becomes `com.nuclearplayer.profile.<name>`.

See [platform-specific info](../misc/platform-specific.md) page for the locations of app data and logs on each platform.

## What is shared by all profiles

All profiles use the same yt-dlp binary, which stays in the `ytdlp` directory of the default profile.

On Mac OS, all profiles also share the webview storage, meaning the layout state - sidebar widths, and so on.
