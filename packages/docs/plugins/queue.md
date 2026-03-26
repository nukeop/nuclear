---
description: Control playback order, manipulate the queue, and react to track changes in Nuclear.
---

# Queue

## Queue API for Plugins

The Queue API gives plugins control over Nuclear's playback queue. Add tracks, reorder items, control navigation, and subscribe to queue changes.

{% hint style="info" %}
Access the queue via `api.Queue.*` in your plugin's lifecycle hooks. All queue operations are asynchronous and return Promises.
{% endhint %}

---

## Core concepts

### Queue structure

The queue is a list of items with a pointer to the current playback position:

```typescript
type Queue = {
  items: QueueItem[];        // Ordered list of tracks
  currentIndex: number;      // Position of currently playing item (0-based)
};
```

### Queue items

Each item in the queue has its own unique ID and tracks its own state:

```typescript
type QueueItem = {
  id: string;                // UUID for this queue entry
  track: Track;              // Full track metadata
  
  // Playback state
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;            // Error message if status is 'error'
  
  // Metadata
  addedAtIso: string;        // ISO timestamp of when added
};
```

**Status lifecycle:**
* `idle` - Item is in queue but hasn't been played yet
* `loading` - Finding candidates, or stream resolution in progress
* `success` - Stream resolved and ready for playback
* `error` - All streams failed or playback error occurred

---

## Usage

{% tabs %}
{% tab title="Reading queue state" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Get the full queue
    const queue = await api.Queue.getQueue();
    console.log(`Queue has ${queue.items.length} items`);
    console.log(`Currently at index ${queue.currentIndex}`);
    
    // Get just the current item
    const current = await api.Queue.getCurrentItem();
    if (current) {
      console.log(`Now playing: ${current.track.title}`);
      console.log(`Status: ${current.status}`);
    }
  },
};
```
{% endtab %}

{% tab title="Adding tracks" %}
```typescript
import type { NuclearPluginAPI, Track } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const tracks: Track[] = [
      // ... your track objects
    ];
    
    // Add to the end of the queue
    await api.Queue.addToQueue(tracks);
    
    // Insert right after the current track
    await api.Queue.addNext(tracks);
    
    // Insert at a specific position
    await api.Queue.addAt(tracks, 5);
  },
};
```
{% endtab %}

{% tab title="Navigation" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Move to next track (respects shuffle and repeat)
    await api.Queue.goToNext();
    
    // Move to previous track
    await api.Queue.goToPrevious();
    
    // Jump to a specific position
    await api.Queue.goToIndex(10);
    
    // Jump to an item by its UUID
    await api.Queue.goToId('some-queue-item-id');
  },
};
```
{% endtab %}

{% tab title="Subscribing to changes" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    // Subscribe to any queue change
    const unsubscribe = api.Queue.subscribe((queue) => {
      console.log(`Queue updated: ${queue.items.length} items`);
    });
    
    // Subscribe only to current item changes
    const unsubscribeCurrent = api.Queue.subscribeToCurrentItem((item) => {
      if (item) {
        console.log(`Now playing: ${item.track.title}`);
      } else {
        console.log('Queue is empty or stopped');
      }
    });
    
    // Clean up in onDisable
    return () => {
      unsubscribe();
      unsubscribeCurrent();
    };
  },
};
```
{% endtab %}
{% endtabs %}

---

## Reference

```typescript
// Reading
api.Queue.getQueue(): Promise<Queue>
api.Queue.getCurrentItem(): Promise<QueueItem | undefined>

// Adding tracks
api.Queue.addToQueue(tracks: Track[]): Promise<void>
api.Queue.addNext(tracks: Track[]): Promise<void>
api.Queue.addAt(tracks: Track[], index: number): Promise<void>

// Removing tracks
api.Queue.removeByIds(ids: string[]): Promise<void>
api.Queue.removeByIndices(indices: number[]): Promise<void>
api.Queue.clearQueue(): Promise<void>

// Navigation
api.Queue.goToNext(): Promise<void>
api.Queue.goToPrevious(): Promise<void>
api.Queue.goToIndex(index: number): Promise<void>
api.Queue.goToId(id: string): Promise<void>

// Reordering
api.Queue.reorder(fromIndex: number, toIndex: number): Promise<void>

// State updates
api.Queue.updateItemState(id: string, updates: QueueItemStateUpdate): Promise<void>

// Subscriptions
api.Queue.subscribe(listener: (queue: Queue) => void): () => void
api.Queue.subscribeToCurrentItem(listener: (item: QueueItem | undefined) => void): () => void
```

## Best practices

* Use subscriptions for reactive features. `subscribe()` for queue-wide changes, `subscribeToCurrentItem()` for playback tracking