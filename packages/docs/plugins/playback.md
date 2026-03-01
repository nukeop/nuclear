---
description: Control audio transport, read playback state, and react to playback changes.
---

# Playback

## Playback API for plugins

The Playback API controls audio states: play, pause, stop, seek, and subscribe to state changes. It doesn't handle track navigation, use the Queue API for that.

{% hint style="info" %}
Access playback via `api.Playback.*` in your plugin's lifecycle hooks. All methods are asynchronous and return Promises.
{% endhint %}

---

## Core concepts

### Playback state

Playback state is exposed through a single object:

```typescript
type PlaybackState = {
  status: PlaybackStatus;
  seek: number;      // Current position in seconds
  duration: number;  // Total duration in seconds
};

type PlaybackStatus = 'playing' | 'paused' | 'stopped';
```

`seek` and `duration` are always in seconds, not milliseconds.

### Playback vs. Queue

These two domains divide playback responsibilities:

| Domain | Responsibility |
|--------|---------------|
| **Playback** | Audio transport: play, pause, stop, seek |
| **Queue** | Track navigation: next, previous, shuffle, repeat |

---

## Usage

{% tabs %}
{% tab title="Reading state" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const state = await api.Playback.getState();
    api.Logger.info(`Status: ${state.status}`);
    api.Logger.info(`Position: ${state.seek}s / ${state.duration}s`);
  },
};
```
{% endtab %}

{% tab title="Transport controls" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    await api.Playback.play();
    await api.Playback.pause();
    await api.Playback.stop();

    // Toggle between play and pause.
    // If stopped, this starts playback.
    await api.Playback.toggle();
  },
};
```
{% endtab %}

{% tab title="Seeking" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Jump to 90 seconds into the current track
    await api.Playback.seekTo(90);

    // Seek relative to the current position
    const state = await api.Playback.getState();
    await api.Playback.seekTo(state.seek + 10); // Forward 10s
  },
};
```
{% endtab %}

{% tab title="Subscribing" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const unsubscribe = api.Playback.subscribe((state) => {
      if (state.status === 'playing') {
        api.Logger.debug(`${state.seek.toFixed(1)}s / ${state.duration.toFixed(1)}s`);
      }
    });

    // Always clean up
    return () => {
      unsubscribe();
    };
  },
};
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
`subscribe` fires frequently during playback as the seek position updates. Keep your listener lightweight to avoid blocking the UI thread.
{% endhint %}

---

## Reference

```typescript
// State
api.Playback.getState(): Promise<PlaybackState>

// Transport
api.Playback.play(): Promise<void>
api.Playback.pause(): Promise<void>
api.Playback.stop(): Promise<void>
api.Playback.toggle(): Promise<void>

// Seeking
api.Playback.seekTo(seconds: number): Promise<void>

// Subscriptions
api.Playback.subscribe(listener: PlaybackListener): () => void
```

### Types

```typescript
type PlaybackStatus = 'playing' | 'paused' | 'stopped';

type PlaybackState = {
  status: PlaybackStatus;
  seek: number;      // Seconds
  duration: number;  // Seconds
};

type PlaybackListener = (state: PlaybackState) => void;
```