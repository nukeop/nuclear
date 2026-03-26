# Nuclear Plugin SDK

Build plugins for Nuclear music player.

Plugins are JavaScript/TypeScript modules that extend Nuclear's functionality. Write lifecycle hooks, register providers, distribute it through the [plugin registry](https://github.com/NuclearPlayer/plugin-registry).

## Quick Start

```bash
mkdir my-plugin && cd my-plugin
pnpm init -y
pnpm add @nuclearplayer/plugin-sdk
```

Create `src/index.ts`:

```ts
import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onLoad(api: NuclearPluginAPI) {
    console.log('Plugin loaded');
  },
  async onEnable(api: NuclearPluginAPI) {
    console.log('Plugin enabled');
  },
  async onDisable(api: NuclearPluginAPI) {
    console.log('Plugin disabled');
  },
  async onUnload(api: NuclearPluginAPI) {
    console.log('Plugin unloaded');
  },
};
```

You can load both TS and JS files. Nuclear compiles TS using esbuild.

## Manifest (package.json)

### Required fields
- `name` - Unique plugin ID (scoped names allowed)
- `version` - Semver version
- `description` - One-line summary
- `author` - Your name

### Optional fields
- `main` - Entry file path (defaults to `index.js` or `dist/index.js`)

### Nuclear-specific config
Add a `nuclear` object for extra metadata:

- `displayName` - Friendly name (defaults to `name`)
- `category` - Arbitrary grouping (e.g., `source`, `integration`, `lyrics`)
- `icon` - See below
- `permissions` - Capabilities your plugin uses (informational only for now)

```json
{
  "name": "@nuclear-plugin/lastfm",
  "version": "0.1.0",
  "description": "Scrobble tracks to Last.fm",
  "author": "Nuclear Team",
  "main": "dist/index.js",
  "nuclear": {
    "displayName": "Last.fm Scrobbler",
    "category": "integration",
    "icon": { "type": "link", "link": "https://example.com/icon.png" },
    "permissions": ["scrobble", "network"]
  }
}
```

## Icons

```ts
type PluginIcon = { type: 'link'; link: string };
```

Link icons should point to a local file path or remote URL.

## Lifecycle Hooks

All hooks are optional. Export a default object with any of:

- `onLoad(api)` - Runs after plugin code loads and manifest is parsed
- `onEnable(api)` - Runs when user enables the plugin
- `onDisable(api)` - Runs when user disables it
- `onUnload(api)` - Runs before plugin is removed from memory

```ts
export default {
  async onLoad(api) {
  },
  async onEnable(api) {
  },
  async onDisable(api) {
  },
  async onUnload(api) {
  },
};
```

## Domain APIs

The `api` object passed to lifecycle hooks provides access to these domain APIs:

| API | Description |
|-----|-------------|
| `api.Settings` | Define, read, and persist plugin settings |
| `api.Queue` | Read and manipulate the playback queue |
| `api.Playback` | Control playback, volume, shuffle, and repeat |
| `api.Events` | Subscribe to player lifecycle events (e.g. track finished) |
| `api.Favorites` | Manage the user's favorite tracks |
| `api.Playlists` | Create, update, and delete playlists |
| `api.Providers` | Register and unregister providers |
| `api.Streaming` | Resolve audio stream URLs for tracks |
| `api.Metadata` | Search and fetch artist/album/track details |
| `api.Dashboard` | Fetch dashboard content (top tracks, new releases, etc.) |
| `api.Discovery` | Fetch track recommendations from providers |
| `api.Shell` | Open URLs in the system browser |
| `api.Http` | Make HTTP requests from plugins and bypass CORS |
| `api.Logger` | Structured logging |
| `api.Ytdlp` | yt-dlp integration |

See the [full documentation](https://docs.nuclearplayer.com) for detailed guides on each API.

## Permissions

Declare what your plugin does in the `permissions` array. Permissions are currently informational. Future versions might show UI for this.

Examples: `network`, `scrobble`, `playback-control`, `lyrics`, `search`, `storage`

## File Structure

```text
my-plugin/
  package.json
  src/
    index.ts
  dist/
    index.js
```

## Building

You can use any bundler that outputs a single JS file. Your bundle needs to work in a CommonJS environment (`module.exports` or `exports.default`).

Example with tsup:

```json
{
  "devDependencies": { "tsup": "^8" },
  "scripts": { "build": "tsup src/index.ts --dts --format cjs --minify --out-dir dist" }
}
```

Run `pnpm build` and you'll get `dist/index.js`.

## Development

1. Create your plugin folder
2. Build to produce the entry file
3. Load it in Nuclear
4. You'll need to reload the plugin after changes

## Types

```ts
import type {
  NuclearPlugin,
  PluginManifest,
  PluginIcon,
  // Model types (re-exported from @nuclearplayer/model)
  ArtistCredit,
  Album,
  Track,
  // ... and many more
} from '@nuclearplayer/plugin-sdk';
```

## License

AGPL-3.0-only