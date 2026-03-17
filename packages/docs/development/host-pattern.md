---
description: How the plugin SDK connects to the player through hosts.
---

# Host pattern

Nuclear exposes player functionality to plugins through the **host pattern**. Every feature area the plugin system supports follows the same three-layer structure:

1. Host type - the contract (SDK, no implementation)
2. API class - what plugins actually call (SDK, wraps the host)
3. Host implementation - bridges the API to player internals (player)

Plugins call methods on an API class (e.g. `api.Queue.addToQueue()`), which holds a reference to the host and delegates to it.

## The three layers

### 1. Host interface (`packages/plugin-sdk/src/types/`)

A TypeScript type with no implementation. Defines exactly what the player must provide for a domain.

```typescript
// types/queue.ts
export type QueueHost = {
  getQueue(): Queue;
  addToQueue(tracks: Track[]): void;
  // ...
};
```

### 2. API class (`packages/plugin-sdk/src/api/`)

The surface plugins interact with. Holds an optional reference to the host and guards every call with `#withHost`, which throws if the host isn't present (e.g. in a test environment where no player is running).

```typescript
// api/queue.ts
export class QueueAPI {
  #host?: QueueHost;

  constructor(host?: QueueHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: QueueHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Queue host not available');
    }
    return fn(host);
  }

  addToQueue(tracks: Track[]) {
    return this.#withHost((host) => host.addToQueue(tracks));
  }
}
```

All API classes are assembled into `NuclearAPI` in `packages/plugin-sdk/src/api/index.ts`, which is what plugins receive as their `api` object.

### 3. Host implementation (`packages/player/src/services/`)

Lives in the player. Implements the host interface and bridges it to whatever backs the domain - a Zustand store, a provider registry, a Tauri API, etc.

```typescript
// services/queueHost.ts
import type { QueueHost } from '@nuclearplayer/plugin-sdk';
import { useQueueStore } from '../stores/queueStore';

export const createQueueHost = (): QueueHost => ({
  getQueue: () => useQueueStore.getState().queue,
  addToQueue: (tracks) => useQueueStore.getState().addToQueue(tracks),
  // ...
});

export const queueHost = createQueueHost();
```

The singleton is passed into `NuclearPluginAPI` by `createPluginAPI` (`packages/player/src/services/plugins/createPluginAPI.ts`) when a plugin loads.

## What hosts wrap

| Domain | Backed by |
|--------|-----------|
| Queue, Settings, Favorites | Zustand store |
| Metadata, Streaming, Dashboard | Plugin provider registry and optional store |
| HTTP | Fetch wrapper (implemented in Rust) |
| Shell | Tauri shell API |
| Logger | Scoped logger |

Provider-backed hosts resolve which registered provider to call and check capabilities where the domain supports them. See the [Providers](../plugins/providers.md) doc for how providers register and what kinds exist.

## Data flow

When a plugin calls `api.Metadata.search({ query: 'Radiohead' })`:

1. Plugin calls `api.Metadata.search(params)`
2. `MetadataAPI.#withHost` checks host is present, calls `metadataHost.search(params)`
3. `metadataHost` resolves the active metadata provider from the registry
4. `metadataHost` calls `provider.searchArtists(params)` (or whatever the provider implements)
5. Provider calls its external API, returns `ArtistRef[]`
6. `metadataHost` returns `SearchResults` to the plugin

## Adding a new domain

1. Define the host interface in `packages/plugin-sdk/src/types/yourDomain.ts`
2. Create the API class in `packages/plugin-sdk/src/api/yourDomain.ts` - wraps the host with `#withHost`
3. Add the host option and API field to `NuclearAPI` in `packages/plugin-sdk/src/api/index.ts`
4. Implement the host in `packages/player/src/services/yourDomainHost.ts`
5. Pass the singleton into `NuclearPluginAPI` in `createPluginAPI.ts`
