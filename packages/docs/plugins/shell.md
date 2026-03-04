---
description: Open URLs in the user's system browser from a plugin.
---

# Shell

## Shell API for plugins

The Shell API lets plugins use select functions to interact with the user's system. It lets you support OAuth flows where the user needs to approve access on an external site.

{% hint style="info" %}
Access the Shell API via `api.Shell.*` in your plugin's lifecycle hooks.
{% endhint %}

---

## Usage

A typical use case is redirecting the user to an external auth page:

```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const token = await getAuthToken();
    const authUrl = `https://example.com/auth?token=${token}`;
    await api.Shell.openExternal(authUrl);
  },
};
```

---

## Reference

```typescript
api.Shell.openExternal(url: string): Promise<void>
```

Opens `url` in the user's default system browser. Delegates to Tauri's opener plugin.

### Types

```typescript
type ShellHost = {
  openExternal(url: string): Promise<void>;
};
```
