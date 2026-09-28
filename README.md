<p align="center">
  <picture>
    <source alt="Nuclear Music Player"  srcset="packages/docs/.gitbook/assets/readme-banner.png">
    <img alt="Nuclear Music Player"  srcset="packages/docs/.gitbook/assets/readme-banner.png">
  </picture>


</p>

<div align="center">

# Nuclear 

</div>

<div align="center">

  Nuclear is a free, open-source music player without ads or tracking. Search for any song or artist, build playlists, and start listening.<br>
  Runs on Windows, macOS, and Linux.
  
</div>

## Screenshots

<p align="center">
  <img src="packages/docs/.gitbook/assets/dashboard-main.png" alt="Nuclear Music Player - Dashboard" width="100%">
</p>

Nuclear comes with multiple built-in themes, with light and a dark modes:

<p align="center">
  <img src="packages/docs/.gitbook/assets/dashboard-aurora-light.png" alt="Aurora theme, light mode" width="32%">
  <img src="packages/docs/.gitbook/assets/dashboard-ember-light.png" alt="Ember theme, light mode" width="32%">
  <img src="packages/docs/.gitbook/assets/dashboard-lagoon-light.png" alt="Lagoon theme, light mode" width="32%">
</p>
<p align="center">
  <img src="packages/docs/.gitbook/assets/dashboard-default-dark.png" alt="Default theme, dark mode" width="32%">
  <img src="packages/docs/.gitbook/assets/dashboard-lagoon-dark.png" alt="Lagoon theme, dark mode" width="32%">
  <img src="packages/docs/.gitbook/assets/dashboard-arctic-moss-dark.png" alt="Arctic Moss theme, dark mode" width="32%">
</p>

| | |
|:---:|:---:|
| ![Search artists](packages/docs/.gitbook/assets/search-artists.png) | ![Search albums](packages/docs/.gitbook/assets/search-albums.png) |
| Artist search | Album search |
| ![Search tracks](packages/docs/.gitbook/assets/search-tracks.png) | ![Artist page](packages/docs/.gitbook/assets/artist.png) |
| Track search with recent searches | Artist page |
| ![Album page](packages/docs/.gitbook/assets/album.png) | ![Favorite artists](packages/docs/.gitbook/assets/favorite-artists.png) |
| Album page | Favorites |
| ![Playlists](packages/docs/.gitbook/assets/playlists.png) | ![Playlist](packages/docs/.gitbook/assets/playlist-detail-view.png) |
| Playlists | Playlist |
| ![Listening history](packages/docs/.gitbook/assets/history.png) | ![Listening stats](packages/docs/.gitbook/assets/history-stats.png) |
| Listening history | Listening stats |
| ![Stream sources](packages/docs/.gitbook/assets/stream-candidates.png) | ![Plugin store](packages/docs/.gitbook/assets/plugin-store.png) |
| Stream sources for a queued track | Plugin store |
| ![Installed plugins](packages/docs/.gitbook/assets/installed-plugins.png) | ![Preferences](packages/docs/.gitbook/assets/preferences.png) |
| Installed plugins | Preferences |
| ![What's new](packages/docs/.gitbook/assets/whats-new.png) | ![Log viewer](packages/docs/.gitbook/assets/log-viewer.png) |
| What's new | Log viewer |

Control Nuclear from your phone with Nuclear Jam:

<p align="center">
  <img src="packages/docs/.gitbook/assets/jam-remote.png" alt="Nuclear Jam remote control on a phone" width="300">
</p>

## Download

Grab the latest release for your platform from the [Releases page](https://github.com/nukeop/nuclear/releases).

| Platform | Formats |
|----------|---------|
| Windows | `.exe` installer, `.msi` |
| macOS | `.dmg` (Apple Silicon and Intel) |
| Linux | `.AppImage`, `.deb`, `.rpm`, `.flatpak` |

## Features

- Search for music and stream it from any source
- Browse artist pages with biographies, discographies, and similar artists
- Browse album pages with track listings
- Queue management with shuffle, repeat, and drag-and-drop reordering
- Favorites (albums, artists, and tracks)
- Playlists (create, import, export, import from various services)
- Powerful plugin system with a built-in plugin store
- Themes (built-in and custom CSS themes)
- MCP server lets your AI agent drive the player
- Auto-updates
- Keyboard shortcuts
- Localized in multiple languages

## Plugins

Nuclear has a powerful plugin system now! Every functionality has been redesigned to be driven by plugins.

Plugins can provide streaming sources, metadata, playlists, dashboard content, and more. Browse and install plugins from the built-in plugin store, or write your own using the [@nuclearplayer/plugin-sdk](https://www.npmjs.com/package/@nuclearplayer/plugin-sdk).

## MCP

You can enable the MCP server in Settings → Integrations.

Then to add it to **Claude Code:**

```bash
claude mcp add nuclear --transport http http://127.0.0.1:8800/mcp
```

**Codex CLI:**

```bash
codex mcp add nuclear --url http://127.0.0.1:8800/mcp
```

**OpenCode:**

```json
{
  "mcp": {
    "nuclear": {
      "type": "remote",
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}
```

**Claude Desktop / Cursor / Windsurf:**

```json
{
  "mcpServers": {
    "nuclear": {
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}
```

The MCP is designed to be discoverable, but there's a skill you can load to get your AI up to speed: [Nuclear MCP Skill](./packages/docs/.gitbook/assets/nuclear-mcp.zip)

## Development

Nuclear is a pnpm monorepo managed with Turborepo. The main app is built with Tauri (Rust + React).

### Prerequisites

- Node.js >= 22
- pnpm >= 9
- Rust (stable)
- Platform-specific Tauri dependencies ([see Tauri docs](https://v2.tauri.app/start/prerequisites/))

### Getting started

```bash
git clone https://github.com/nukeop/nuclear.git
cd nuclear
pnpm install
pnpm dev
```

### Useful commands

```bash
pnpm dev            # Run the player in dev mode
pnpm dev:remote     # Same, but binds Vite to 0.0.0.0 so you can open the remote control UI from other devices on your LAN
pnpm build          # Build all packages
pnpm test           # Run all tests
pnpm lint           # Lint all packages
pnpm type-check     # TypeScript checks
pnpm storybook      # Run Storybook
```

## Community

- [Discord](https://discord.gg/JqPjKxE)
- [Mastodon](https://fosstodon.org/@nuclearplayer)
- [Discussions](https://github.com/nukeop/nuclear/discussions)

## License

AGPL-3.0. See [LICENSE](LICENSE).
