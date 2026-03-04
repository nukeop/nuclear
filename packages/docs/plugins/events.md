---
description: Subscribe to player lifecycle events and react to playback milestones.
---

# Events

## Events API for plugins

The Events API is a typed pub/sub system that lets plugins react to player lifecycle events. The player emits events and the plugins subscribe to them.

{% hint style="info" %}
Access events via `api.Events.*` in your plugin's lifecycle hooks. The `on` method is synchronous and returns an unsubscribe function.
{% endhint %}

---

## Core concepts

### Event model

Plugins subscribe to named events using `api.Events.on(eventName, listener)`. Each event carries a typed payload. The player fires events at specific moments during playback, and all registered listeners for that event run synchronously in the order they were added.

Because listeners run synchronously, keep them lightweight. Offload heavy work (network requests, file I/O) to asynchronous callbacks rather than blocking the event dispatch.

### Available events

| Event | Payload | When fired |
|-------|---------|------------|
| `trackFinished` | `Track` | A track finishes playing naturally (audio reaches the end). Not fired on skip or stop. |

### Cleanup

`on` returns an unsubscribe function. Always call it during `onDisable` to prevent memory leaks and stale listeners.

---

## Usage

Subscribing to events:

```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  onEnable(api: NuclearPluginAPI) {
    const unsubscribe = api.Events.on('trackFinished', (track) => {
      api.Logger.info(`Finished: ${track.title}`);
    });

    // Return a cleanup function for onDisable
    return () => {
      unsubscribe();
    };
  },
};
```

{% hint style="warning" %}
Events fire synchronously. If your listener does async work (network calls, disk writes), wrap it in a fire-and-forget pattern as shown in the scrobbling example. Blocking the event dispatch delays queue advancement and other listeners.
{% endhint %}

---

## Reference

```typescript
// Subscriptions
api.Events.on<E extends keyof PluginEventMap>(
  event: E,
  listener: (payload: PluginEventMap[E]) => void
): () => void
```

### Types

```typescript
type PluginEventMap = {
  trackFinished: Track;  // from @nuclearplayer/model
};

type PluginEventListener<E extends keyof PluginEventMap> = (
  payload: PluginEventMap[E],
) => void;
```

The `Track` payload has this shape:

```typescript
type Track = {
  title: string;
  artists: ArtistCredit[];
  album?: AlbumRef;
  durationMs?: number;
  trackNumber?: number;
  disc?: string;
  artwork?: ArtworkSet;
  tags?: string[];
  source: ProviderRef;
};
```
