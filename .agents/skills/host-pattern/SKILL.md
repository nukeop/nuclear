---
name: host-pattern
description: Use when adding a new domain to Nuclear's plugin system, or implementing a host. Covers the host pattern (how player functionality is exposed to plugins), the host interface and API class structure, how hosts are implemented in the player, error handling conventions, and what files to create and modify. Trigger phrases include "add a domain", "new domain", "host implementation", "host pattern", "createPluginAPI".
---

# Host pattern

A host is an object the player creates and passes into each plugin. It gives plugins a typed interface into player functionality without exposing internals. Every feature area follows the same structure.

```
SDK: host interface (type) + API class (wrapper)
Player: host implements the interface, passed into NuclearAPI constructor
```

## Files to create/modify

### SDK (`packages/plugin-sdk/`)

| Action | File | What |
|--------|------|------|
| Create | `src/types/yourDomain.ts` | `YourDomainHost` interface + related types |
| Create | `src/api/yourDomain.ts` | `YourDomainAPI` class |
| Modify | `src/api/index.ts` | Add `yourDomainHost` option + `YourDomain` field to `NuclearAPI` |
| Modify | `src/index.ts` | Export types and API class |

### Player (`packages/player/`)

| Action | File | What |
|--------|------|------|
| Create | `src/services/yourDomainHost.ts` | Host implementation + singleton export |
| Modify | `src/services/plugins/createPluginAPI.ts` | Pass singleton to `NuclearPluginAPI` |
| Modify | `src/services/logger.ts` | Add domain to `LOG_SCOPES` (needed for `reportError`) |

If the domain needs shared model types: create `packages/model/src/yourDomain.ts` and re-export from `packages/model/src/index.ts`.

## API class pattern

Every API class follows this structure. The local variable binding before the null check is required — TypeScript doesn't narrow private class fields across statements.

```typescript
// packages/plugin-sdk/src/api/yourDomain.ts
export class YourDomainAPI {
  #host?: YourDomainHost;

  constructor(host?: YourDomainHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: YourDomainHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('YourDomain host not available');
    }
    return fn(host);
  }

  yourMethod(arg: SomeType) {
    return this.#withHost((host) => host.yourMethod(arg));
  }
}
```

Reference: `packages/plugin-sdk/src/api/queue.ts`, `packages/plugin-sdk/src/api/dashboard.ts`

## Connecting to NuclearAPI

```typescript
// packages/plugin-sdk/src/api/index.ts
import type { YourDomainHost } from '../types/yourDomain';
import { YourDomainAPI } from './yourDomain';

// Add to class:
readonly YourDomain: YourDomainAPI;

// Add to constructor opts type:
yourDomainHost?: YourDomainHost;

// Add to constructor body:
this.YourDomain = new YourDomainAPI(opts?.yourDomainHost);
```

```typescript
// packages/player/src/services/plugins/createPluginAPI.ts
import { yourDomainHost } from '../../services/yourDomainHost';
// Add to NuclearPluginAPI constructor call:
yourDomainHost,
```

## Host implementation

Hosts bridge the SDK contract to whatever backs the domain. Most commonly a Zustand store:

```typescript
// packages/player/src/services/yourDomainHost.ts
import type { YourDomainHost } from '@nuclearplayer/plugin-sdk';
import { useYourDomainStore } from '../stores/yourDomainStore';

export const createYourDomainHost = (): YourDomainHost => ({
  yourMethod: (arg) => useYourDomainStore.getState().doThing(arg),
  getState: () => useYourDomainStore.getState().value,
});

export const yourDomainHost = createYourDomainHost();
```

A host can also have access to the **provider registry** (metadata, streaming, dashboard), resolving which registered provider to call. Two patterns:

**Single provider** (user picks one in Sources):

```typescript
const getProvider = (providerId?: string) =>
  providersHost.get<YourProvider>(
    providerId ?? providersHost.getActive('yourkind'), 'yourkind',
  );

export const createYourDomainHost = (): YourDomainHost => ({
  async fetch(query, providerId?) {
    const provider = getProvider(providerId);
    if (!provider) throw new Error('No provider available');
    return provider.fetch(query);
  },
});
```

**Fan-out** (aggregate across all providers — dashboard):

```typescript
export const createYourDomainHost = (): YourDomainHost => ({
  async fetchAll() {
    const providers = providersHost.list('yourkind') as YourProvider[];
    const results = await Promise.allSettled(providers.map(async (provider) => {
      const items = await provider.fetch();
      return { providerId: provider.id, providerName: provider.name, items };
    }));
    return results.filter(isFulfilled).map((r) => r.value);
  },
});
```

Reference: `packages/player/src/services/metadataHost.ts` (single), `packages/player/src/services/dashboardHost.ts` (fan-out)

## Error handling

- **Store-backed hosts**: let errors propagate naturally.
- **Provider-backed, single provider** (metadata, streaming): throw errors so the user sees failures.
- **Provider-backed, fan-out** (dashboard): catch per-provider so one failure doesn't block others. Log via `reportError`, return partial results.
- `MissingCapabilityError`: always a plugin bug. Single-provider domains throw it; fan-out domains log it and skip the offending provider.
