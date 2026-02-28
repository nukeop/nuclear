---
description: Nuclear Music Player docs
---

# Nuclear Documentation

Nuclear is a free, open‑source music player that acts as a hub for many services. This documentation is for both users and developers: start using the player, customize it with themes, or extend it with plugins.

## Quick links

| Site     | Website                                                                    |
| -------- | -------------------------------------------------------------------------- |
| Website  | [https://nuclearplayer.com/](https://nuclearplayer.com/)                   |
| Github   | [https://github.com/nukeop/nuclear](https://github.com/nukeop/nuclear)     |
| Discord  | [https://discord.gg/JqPjKxE](https://discord.gg/JqPjKxE)                   |
| Mastodon | [https://fosstodon.org/@nuclearplayer](https://fosstodon.org/@nuclearplayer) |
| Gitbook  | [https://docs.nuclearplayer.com](https://docs.nuclearplayer.com)   |

## For users

- Themes: Nuclear supports theming. You can load your own JSON themes or choose built‑ins.
- Plugins: Extend Nuclear with plugins. There is no sandbox, plugins can control the player directly. Only install plugins you trust.

## What is in this repo?

This is a pnpm/turbo monorepo with these major packages:

- @nuclearplayer/player - Main Tauri app (React + Rust)
- @nuclearplayer/ui - Shared UI components
- @nuclearplayer/themes - Theming system and utilities
- @nuclearplayer/plugin-sdk - Plugin framework and helpers
- @nuclearplayer/model - Shared data model
- @nuclearplayer/hifi - Advanced HTML5 audio engine
- @nuclearplayer/storybook - Component demos
- @nuclearplayer/tailwind-config - Shared Tailwind v4 CSS config
- @nuclearplayer/docs - This documentation

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