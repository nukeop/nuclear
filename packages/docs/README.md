---
description: Nuclear - Music streaming app for your desktop
---

# Nuclear Documentation

Nuclear is a free, open-source music player without ads or tracking. Search for any song or artist, build playlists, and start listening. This documentation is for both users and developers.

## Quick links

| Site     | Website                                                                    |
| -------- | -------------------------------------------------------------------------- |
| Website  | [https://nuclearplayer.com/](https://nuclearplayer.com/)                   |
| Github   | [https://github.com/nukeop/nuclear](https://github.com/nukeop/nuclear)     |
| Discord  | [https://discord.gg/JqPjKxE](https://discord.gg/JqPjKxE)                   |
| Mastodon | [https://fosstodon.org/@nuclearplayer](https://fosstodon.org/@nuclearplayer) |
| Gitbook  | [https://docs.nuclearplayer.com](https://docs.nuclearplayer.com)   |

## For users

New to Nuclear? Start here:

- [Getting started](user-manual/getting-started.md) - install Nuclear and play your first song
- [How Nuclear works](core-concepts/how-nuclear-works.md) - understand the plugin model and how playback works
- [Plugins and providers](core-concepts/plugins-and-providers.md) - what plugins do and how to manage your sources
- [Installation](user-manual/installation.md) - platform-specific download and install instructions
- [Themes](themes/themes.md) - customize Nuclear's appearance with built-in, custom, or community themes

## What is in this repo?

This is a pnpm/turbo monorepo with these major packages:

- @nuclearplayer/player - Main Tauri app (React + Rust)
- @nuclearplayer/ui - Shared UI components
- @nuclearplayer/themes - Theming system and utilities
- @nuclearplayer/plugin-sdk - Plugin framework and helpers
- @nuclearplayer/model - Shared data model
- @nuclearplayer/hifi - Advanced HTML5 audio engine
- @nuclearplayer/i18n - Internationalization
- @nuclearplayer/storybook - Component demos
- @nuclearplayer/tailwind-config - Shared Tailwind v4 CSS config
- @nuclearplayer/eslint-config - Shared linting rules
- @nuclearplayer/tools - Build and maintenance utilities
- @nuclearplayer/docs - This documentation
- @nuclearplayer/website - Project website

## For developers

### Tech highlights

- TypeScript everywhere
- Tauri (desktop shell)
- React 18
- Tailwind v4 configured via CSS (@theme/@layer), no tailwind.config.js
- TanStack Router (routing)
- TanStack Query v5 (HTTP and client‑side server state; no backend server)
- Vitest + React Testing Library (tests)
- Coverage via V8 with CI reporting

### Common workspace tasks

Run these from the repo root:

```bash
pnpm dev            # Run player (and UI) in dev mode
pnpm build          # Build all packages
pnpm lint           # Lint all packages
pnpm test           # Run all tests
pnpm test:coverage  # Run tests with coverage
pnpm type-check     # TypeScript checks
pnpm tauri          # Tauri CLI for the player
pnpm storybook      # Run Storybook
```