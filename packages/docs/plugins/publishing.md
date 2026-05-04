---
description: Package, release, and submit your plugin to the Nuclear plugin store.
---

# Publishing

Nuclear's plugin store is backed by a static registry at [github.com/NuclearPlayer/plugin-registry](https://github.com/NuclearPlayer/plugin-registry). The registry lists plugin metadata (name, repo, category). The actual plugin code lives in the developer's own GitHub repository. When a user installs a plugin, Nuclear fetches the latest GitHub release from that repo.

Publishing a plugin takes three steps: configure your `package.json`, create a GitHub release with a `plugin.zip` asset, and submit a PR to the registry.

---

## package.json requirements

Your plugin's `package.json` must include these fields:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Plugin identifier. Lowercase, hyphens allowed. Must match the `id` in the registry. |
| `version` | yes | Semver (e.g., `1.0.0`) |
| `description` | yes | Short description |
| `author` | yes | Your name or GitHub username |
| `main` | no | Entry point (e.g., `dist/index.js`). If omitted, Nuclear tries `index.js`, `index.ts`, `index.tsx`, then `dist/index.*`. |

### The `nuclear` field

The `nuclear` field holds Nuclear-specific config:

```json
{
  "nuclear": {
    "displayName": "My Plugin",
    "categories": ["metadata"],
    "icon": {
      "type": "link",
      "link": "https://example.com/icon.png"
    },
    "permissions": ["network"]
  }
}
```

| Property | Required | Description |
|----------|----------|-------------|
| `displayName` | no | Human-readable name shown in the UI. Falls back to `name`. |
| `categories` | no | Array of categories. Valid values: `streaming`, `metadata`, `lyrics`, `scrobbling`, `dashboard`, `playlists`, `discovery`, `other`. Required for registry submission. |
| `icon` | no | Plugin icon. Only `{"type": "link", "link": "url"}` is supported. |
| `permissions` | no | Informational list. No permissions are enforced yet; this is for future use. |

{% hint style="info" %}
A plugin can belong to multiple categories. Pick all that apply based on the provider types your plugin registers.
{% endhint %}

### Full example

```json
{
  "name": "nuclear-plugin-discogs",
  "version": "1.0.0",
  "description": "Fetch album and artist metadata from Discogs",
  "author": "nukeop",
  "license": "MIT",
  "main": "dist/index.js",
  "nuclear": {
    "displayName": "Discogs",
    "categories": ["metadata"]
  }
}
```

---

## Creating a GitHub release

1. Tag your commit with a semver version (e.g., `v1.0.0`).
2. Create a GitHub release from that tag.
3. Attach a file named exactly `plugin.zip` as a release asset.
4. Publish the release.

Nuclear looks for an asset named `plugin.zip` in the latest release. If it's missing, installation fails.

### What goes in plugin.zip

The zip should contain your built plugin files at the root level, not nested in a subdirectory:

```
plugin.zip
├── index.js          # Entry point (or whatever `main` points to)
├── package.json      # Plugin metadata
└── ...               # Any other files your plugin needs
```

{% hint style="warning" %}
Files must be at the root of the zip, not inside a subdirectory. If your zip contains `my-plugin/index.js` instead of `index.js`, the plugin won't load.
{% endhint %}

Nuclear can compile TypeScript on the fly, so you can ship `.ts` or `.tsx` source files instead of pre-built JavaScript. Pre-building is recommended for faster load times.

Set up CI to build and create the release automatically. Manual zip creation is error-prone.

---

## Submitting to the registry

1. Fork [NuclearPlayer/plugin-registry](https://github.com/NuclearPlayer/plugin-registry).
2. Add your plugin to the `plugins` array in `plugins.json`:

```json
{
  "id": "nuclear-plugin-discogs",
  "name": "Discogs",
  "description": "Fetch album and artist metadata from Discogs",
  "author": "nukeop",
  "repo": "NuclearPlayer/nuclear-plugin-discogs",
  "category": "metadata",
  "categories": ["metadata"],
  "tags": ["discogs", "metadata"],
  "version": "1.0.0",
  "downloadUrl": "https://github.com/NuclearPlayer/nuclear-plugin-discogs/releases/download/v1.0.0/plugin.zip",
  "addedAt": "2026-01-25T00:00:00Z"
}
```

3. Open a pull request.

### Registry entry fields

| Field | Required | Constraints |
|-------|----------|-------------|
| `id` | yes | Must match `name` in your `package.json`. Lowercase, hyphens, 2-64 chars. |
| `name` | yes | Display name, 1-64 chars. |
| `description` | yes | 10-200 chars. |
| `author` | yes | 1-64 chars. |
| `repo` | yes | `owner/repo-name` format. |
| `category` | yes | Must match your `package.json` `nuclear.category`. |
| `categories` | yes | Array of categories matching your plugin's provider types. Same valid values as `nuclear.categories` in package.json. |
| `tags` | no | Up to 10 tags, lowercase with hyphens, unique. |
| `version` | no | Latest released semver version. Populated automatically by CI. |
| `downloadUrl` | no | Direct URL to the latest `plugin.zip`. Populated automatically by CI. |
| `addedAt` | yes | ISO 8601 datetime (e.g., `2026-01-25T00:00:00Z`). |

---

## Updating your plugin

You don't need to update the registry to release new versions. Create a new GitHub release with an updated `plugin.zip`, and Nuclear will fetch it the next time someone installs your plugin.

Only submit a registry PR if you need to change the plugin's metadata (description, category, tags, etc.).

{% hint style="info" %}
Nuclear checks for plugin updates on startup. If auto-update is enabled (it is by default), installed store plugins are automatically updated to the latest version. Users can disable this in Settings under Plugins.
{% endhint %}

## Examples

You can find example plugins on Github: [github.com/NuclearPlayer](https://github.com/NuclearPlayer).