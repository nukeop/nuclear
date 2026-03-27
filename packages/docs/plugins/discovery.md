---
description: Recommend tracks based on the user's listening context
---

# Discovery

## Discovery providers

Discovery providers recommend tracks based on what the user is listening to. When the user reaches the last track in their queue, Nuclear asks the active discovery provider for recommendations and appends them automatically.

The provider receives the last 10 tracks from the queue as context and returns new tracks to add to the queue.

Plugins can either add a new discovery provider, or request recommendations from existing providers.

---

## Implementing a provider

### Minimal example

You register discovery providers with `api.Providers.register()` just like any other provider. It needs an `id`, `kind: 'discovery'`, a `name`, and a `getRecommendations` method:

```typescript
import type { DiscoveryProvider, NuclearPlugin, NuclearPluginAPI, Track } from '@nuclearplayer/plugin-sdk';

const provider: DiscoveryProvider = {
  id: 'acme-discovery',
  kind: 'discovery',
  name: 'Acme Recommendations',

  async getRecommendations(context: Track[], options) {
    const { variety, limit = 5 } = options;

    // Use the context tracks to find recommendations.
    // `variety` controls how far to deviate from the listening context.
    const artistNames = context.map((track) => track.artists[0]?.name).filter(Boolean);

    const response = await fetch(
      `https://api.acme.example/recommend?artists=${artistNames.join(',')}&variety=${variety}&limit=${limit}`,
    );
    const data = await response.json();

    return data.tracks.map((track) => ({
      title: track.name,
      artists: [{ name: track.artist, roles: ['main'] }],
    }));
  },
};

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Providers.register(provider);
  },
  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister('acme-discovery');
  },
};

export default plugin;
```

{% hint style="warning" %}
Always unregister your provider in `onDisable`. If you don't, it stays registered and Nuclear will keep calling it after the plugin is disabled.
{% endhint %}

---

## The `getRecommendations` method

```typescript
getRecommendations(context: Track[], options: DiscoveryOptions): Promise<Track[]>
```

Nuclear calls this when the user is about to run out of tracks. The two arguments:

| Parameter | Type | Description |
|-----------|------|-------------|
| `context` | `Track[]` | The last 10 tracks from the queue, ordered from oldest to newest |
| `options` | `DiscoveryOptions` | Controls for the recommendation behavior |

Each returned `Track` needs at minimum a `title` and an `artists` array with at least one entry.

### `DiscoveryOptions`

| Field | Type | Description |
|-------|------|-------------|
| `variety` | `number` | Float from 0 to 1. How far to deviate from the current listening context |
| `limit` | `number?` | Max number of tracks to return. The player requests 5 at a time |

### The variety parameter

The `variety` value tells the provider how adventurous to be, from 0.0 to 1.0.

How you interpret this is up to your implementation, but the contract is: lower values produce more similar results, higher values produce more diverse ones.

### The limit parameter

Providers can return fewer tracks than the limit. If your source only has 3 good recommendations and the limit is 5, return 3.

---

## Type reference

### `DiscoveryProvider`

```typescript
type DiscoveryProvider = ProviderDescriptor<'discovery'> & {
  getRecommendations: (
    context: Track[],
    options: DiscoveryOptions,
  ) => Promise<Track[]>;
};
```

Where `ProviderDescriptor<'discovery'>` gives you:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for this provider |
| `kind` | `'discovery'` | Always `'discovery'` |
| `name` | `string` | Display name shown in the UI |
| `pluginId` | `string?` | Set automatically by the SDK when the provider is registered |

### `DiscoveryOptions`

```typescript
type DiscoveryOptions = {
  variety: number;
  limit?: number;
};
```

---

## Using discovery data

Plugins can request recommendations from the active discovery provider via `api.Discovery.*`:

```typescript
export default {
  async onEnable(api: NuclearPluginAPI) {
    const queue = await api.Queue.getTracks();
    const lastTen = queue.slice(-10);

    const recommendations = await api.Discovery.getRecommendations(
      lastTen,
      { variety: 0.5, limit: 10 },
    );

    for (const track of recommendations) {
      api.Logger.info(`Recommended: ${track.title}`);
    }
  },
};
```

### Consumer reference

```typescript
api.Discovery.getRecommendations(
  context: Track[],
  options: DiscoveryOptions,
  providerId?: string,
): Promise<Track[]>
```

The optional `providerId` targets a specific discovery provider. If omitted, Nuclear uses whichever provider is active.

---

## Related settings

| Setting | Type | Description |
|---------|------|-------------|
| `core.playback.discovery` | `boolean` | Whether discovery is enabled. Controlled by the BoomBox button in the player bar (not visible in Settings) |
| `core.playback.discoveryVariety` | `number` | The variety value (0-1) passed to providers. Configured via the variety slider in Settings > Playback |
