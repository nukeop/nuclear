# Nuclear Music Player - Copilot Instructions

## Project overview

Nuclear is a free, open-source music player without ads or tracking. Search for any song or artist, build playlists, and start listening.

It's a monorepo managed with pnpm and turbo.

This particular repo is a rewrite project, with the original Nuclear codebase in a different repo. 

### Key features

- **Themes**: Support for basic and advanced themes, which work by customizing CSS variables that then control Tailwind classes. Users can load their own themes from JSON, or use built-in ones.
- **Plugins**: A powerful plugin system that allows you to control any part of the player. No sandboxing.

### Tech stack

- Typescript - primary language.
- Tauri - creates a native desktop application shell.
- Tailwind v4 - CSS-first setup. Configured via CSS using @theme and @layer (see `packages/tailwind-config/global.css`). No tailwind.config.js. Don't use built-in colors, prefer the palette defined in `global.css`.
- Turbo repo - tool for managing the monorepo.
- pnpm - the preferred package manager. Used for workspaces.
- eslint + prettier - formatting and linting.
- Storybook - used for demoing UI components.
- Vite - build tool
- Vitest - for all tests
- Lucide React - icon library
- framer-motion and tw-animate-css - for animations
- TanStack Router - chosen solution for routing.
- TanStack Query v5 - chosen solution for HTTP requests.

### Packages
- `@nuclearplayer/player` - Main Tauri app (React + Rust).  
- `@nuclearplayer/plugin-sdk` - Plugin system (TS/React).  
- `@nuclearplayer/ui` - Shared UI components.  
- `@nuclearplayer/model` - Data model.
- `@nuclearplayer/docs` - Gitbook documentation.
- `@nuclearplayer/tailwind-config` - Shared Tailwind config.  
- `@nuclearplayer/eslint-config` - Shared linting & formatting rules.  
- `@nuclearplayer/hifi` - Advanced HTML5 audio component for playback.
- `@nuclearplayer/themes` - Theming system.
- `@nuclearplayer/storybook` - Storybook stories.

### Workflow Commands

```bash
pnpm dev        # run the project in dev mode
pnpm build      # build all packages
pnpm lint       # lint all packages
pnpm test       # test all packages
pnpm test:coverage  # run tests with coverage
pnpm type-check     # run TypeScript checks across packages
pnpm tauri          # run Tauri CLI for the player
pnpm storybook      # run Storybook
```

## Coding principles

### General

- Prioritize readability.
- This is a production project meant for long term maintenance and development. Cutting corners, using short term solutions, placeholders, half-baked methods, and messy code is unacceptable.
- Avoid premature abstractions. Start concrete, extract later.
- Prefer clarity over cleverness.
- Do not leave comments in code. Their place is in the chat.
- Stick to existing conventions. This is a monorepo so standardizing everything is very very important. Look at other packages when in doubt. Use centralized configs for tools like Typescript, Eslint, Prettier, Tailwind.
- Break work into the smallest reasonable steps. Small commits > big dumps.
- Always be on the lookout for dead code, copy-pasta, and other opportunities to optimize and trim the codebase in a sensible way.

### TypeScript / React
- Use `type`, not `interface` (except when TS requires merging). Do not use interfaces for props.
- Use `const Component: FC<Props> = () => {}` instead of `function Component()`.
- No magic numbers → extract into named constants.
- Prefer compound components (`Component.Sub`) when building complex widgets.
- Keep business logic out of UI components.

### Architecture
- UI components should stay dumb, presentation-only.
- State management:
  - **Zustand** for persistent UI state.  
  - **React state** for local, temporary state.
  - **TanStack Query v5 (aka react-query)** for HTTP requests.
- Routing:
  - **TanStack Router** for client-side routing.
- Lift complex or performance-critical logic to Tauri (Rust).

### Testing
- Use **Vitest + React Testing Library**.
- Test like a user: minimal mocks, simulate interactions.
- Only mock external dependencies (HTTP, FS, Tauri).
- Snapshot tests: **basic rendering only**. Start names with `(Snapshot)`.
- Extract DOM querying into wrappers; assertions stay in tests.
- Coverage: enabled across packages with V8-based coverage and CI reporting.
- Use the test runner tool instead of running tests in the terminal manually.

### Design & UX Philosophy

- Visual style: **neo-brutalist with premium polish**.
- Animations should enhance UX, not slow it down.
- Disable animations during high-friction moments (e.g., resize).
- Use **framer-motion** + **tw-animate-css** for smooth springy physics.
- Feel: professional yet approachable, Discord-like.

#### Typography

- Fonts are standardized at the design system level. Prefer utilities `font-sans` and `font-heading` when needed.
- Defaults are applied for common HTML tags (e.g., body, headings), so you rarely need to set fonts manually.

## Final Notes

- Treat this as **production code from day one**. No shortcuts, no placeholders.
- Prioritize long-term maintainability.
- Work with me iteratively: pause, summarize, ask.
- Above all: **be reliable, disciplined, and clear.**
- Use Serena tools wherever possible for searches, lookups, replacements, and file operations.