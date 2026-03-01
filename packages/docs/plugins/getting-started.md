---
description: Create and load your first Nuclear plugin and verify the SDK works end-to-end.
---

# Getting started

Spin up a bare plugin, load it in Nuclear, and poke the Plugin SDK to make sure everything is wired.

{% hint style="info" %}
Plugins are folders on disk with a `package.json` and an entry file. The app loads them at runtime and provides `@nuclearplayer/plugin-sdk` to your code.
{% endhint %}

## Usage

{% tabs %}
{% tab title="1) Folder" %}
Create a folder anywhere on your machine, e.g. `~/nuclear-plugins/hello-plugin`.

Run `npm init` inside.
{% endtab %}

{% tab title="2) package.json" %}
```json
{
  "name": "hello-plugin",
  "version": "0.1.0",
  "description": "Minimal Nuclear plugin",
  "author": "Your Name",
  "main": "index.ts",
  "nuclear": {
    "displayName": "Hello Plugin",
    "category": "Examples"
  }
}
```
{% endtab %}

{% tab title="3) index.ts" %}
```typescript
const CATEGORY = "Examples";

module.exports = {
  async onLoad(api) {
    await api.Settings.register([
      {
        id: "hello",
        title: "Hello world",
        category: CATEGORY,
        kind: "boolean",
        default: true
      }
    ]);

    const v = await api.Settings.get("hello");
    await api.Settings.set("hello", !v);
  },

  async onEnable(api) {
  api.Settings.subscribe("hello", () => {});
  }
};
```

The app compiles TS on the fly. No additional setup is needed.
{% endtab %}
{% endtabs %}

## Load it in the app

1. Open Nuclear → Preference → Plugins (from the left sidebar).
2. Click Add Plugin and select your plugin folder.
3. Toggle it on. `onLoad` runs at import time; `onEnable` runs when you enable.

## Verify the SDK

* Open Settings and find the "Examples" section. You should see "Hello world" with a toggle.
* Flip it. The value persists to disk and updates subscribers.

{% hint style="warning" %}
Setting IDs are auto-namespaced. Use bare IDs like `hello`; the app stores them as `plugin.<pluginId>.hello`.
{% endhint %}

## Plugin shape

```typescript
type Plugin = {
  onLoad?(api: NuclearPluginAPI): void | Promise<void>;
  onEnable?(api: NuclearPluginAPI): void | Promise<void>;
  onDisable?(api: NuclearPluginAPI): void | Promise<void>;
  onUnload?(api: NuclearPluginAPI): void | Promise<void>;
};
```

`package.json` keys used by the loader:

* `name`, `version`, `description`, `author`
* `main` (optional). If missing, the app tries `index.js`, `index.ts`, `index.tsx`, then `dist/index.*`.
* `nuclear.displayName` (optional UI name)
* `nuclear.category` (shown in the Plugins list)
* `nuclear.icon` and `nuclear.permissions` (optional; unknown permissions get a warning)

## Common checks

| Symptom                               | Cause                                  | Fix                                                                      |
| ------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| Plugin not listed after Add           | Missing/invalid `package.json`         | Ensure required fields and a resolvable entry file                       |
| "Plugin must export a default object" | Entry doesn’t default-export an object | Export `module.exports = { ... }` or `export default { ... }`            |
| "Module X not found"                  | Importing unsupported dependency       | Only `@nuclearplayer/plugin-sdk` is provided; bundle or avoid other deps |
| Setting doesn’t appear                | Not registered                         | Call `api.Settings.register([...])` in `onLoad`                          |

## Next steps

* Use the [Settings](settings.md) guide to define richer options.
* Add a real feature under `onEnable`, and store user prefs with the Settings API.
