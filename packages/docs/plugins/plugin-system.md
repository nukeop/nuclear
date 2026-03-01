---
description: How do plugins work in Nuclear?
---

# Plugins

Plugins are a way to extend what Nuclear can do. Nuclear itself is intentionally pretty barebones - it's a framework on which plugin developers can build. Plugins are written in Typescript.

## Plugin installation

When you install a plugin, Nuclear first reads its manifest (`package.json`) to learn about it, then creates a folder in your [appdata](../misc/platform-specific.md#appdata), in `plugins/<pluginName>/<pluginVersion>`. The contents of the plugin are then copied into this folder, and the plugin is loaded from there.

Nuclear keeps a registry of installed plugins in `plugins.json`. It's used on startup to find the locations of installed plugins. They are then loaded in the order of installation dates.