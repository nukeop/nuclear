---
description: How the plugin SDK connects to the player through hosts.
---

# Host pattern

Nuclear exposes player functionality to plugins through the **host pattern**. A host is an object the player creates and passes to each plugin. It gives the plugin a typed interface into player's functionalities without exposing internal implementation details.

Every feature area the plugin system supports follows the same structure.

## The pattern

**Plugin SDK** defines the contract as a TS type without implementation. Examples: QueueHost, PlaylistsHost, DashboardHost (look them up in `packages/plugin-sdk/src/types/`).

**Player** implements the contract. A host file in `src/services/` implements the interface and bridges it to the internal state. Zustand stores, external APIs, registered providers can all form parts of the host implementation. The host singleton gets passed into `NuclearPluginAPI` when a plugin loads.

`createPluginAPI` (`packages/player/src/services/plugins/createPluginAPI.ts`) creates the API instance for each plugin.

## What hosts wrap

A host can be backed with anything. It depends on what the domain needs. Examples:

| Domain | Backed by |
|--------|-----------|
| Queue, Settings, Favorites | Zustand store |
| Metadata, Streaming, Dashboard | Plugin provider registry and optional store |
| HTTP | Fetch wrapper (implemented in Rust) |
| Shell | Tauri shell API |
| Logger | Scoped logger |

Hosts can also allow plugins to use registered providers from the provider registry. These resolve which registered provider to call, and check capabilities if the domain supports them. See the [Providers](../plugins/providers.md) doc for how providers register and what kinds exist.

## Data flow

When a plugin calls `api.Metadata.search({ query: 'Radiohead' })`:

1. Plugin calls `api.Metadata.search(params)`
2. `MetadataAPI.#withHost` checks host is present, calls metadataHost.search(params)
3. `metadataHost` resolves the active metadata provider from the registry
4. `metadataHost` calls `provider.searchArtists(params)` (or whatever the provider implements)
5. Provider calls its external API, returns `ArtistRef[]`
6. `metadataHost` returns `SearchResults` to the plugin

## Adding a new domain

1. Define the host interface in `packages/plugin-sdk/src/types/`
2. Create the API class in `packages/plugin-sdk/src/api/`
3. Connect it to `NuclearAPI` in `packages/plugin-sdk/src/api/index.ts`
4. Implement the host in `packages/player/src/services/`
5. Pass the singleton into `NuclearPluginAPI` in `createPluginAPI.ts`
