---
description: How the MCP server works internally and how to extend it.
---

# MCP architecture

Nuclear's [MCP](https://modelcontextprotocol.io/) server lets your AI control the music player and do anything that plugins can do!

The server runs on `localhost:8800/mcp` using the Streamable HTTP transport.

## The four MCP tools

Rust defines four tools in `tools.rs`. Three are discovery tools that return metadata directly from Rust. The fourth, `call`, goes through a Rust-Typescript IPC bridge to execute methods in TypeScript.

| Tool | Purpose | Arguments |
|------|---------|-----------|
| `list_methods` | List methods in a domain | `{ domain: "Queue" }` |
| `method_details` | Get parameter names, types, return type for a method | `{ method: "Queue.addToQueue" }` |
| `describe_type` | Get the JSON shape of a data type (Track, QueueItem, etc.) | `{ type: "Track" }` |
| `call` | Execute a method | `{ method: "Queue.addToQueue", params: { tracks: [...] } }` |

## Discovery tools

`list_methods`, `method_details`, and `describe_type` are handled entirely in Rust. All API metadata (domain listings, method signatures, type shapes) is inlined in `mcp/metadata.rs` as static JSON.

## The IPC bridge

Nuclear has a generic Rust-to-TypeScript bridge that the MCP server uses as an adapter. The bridge lives in `src-tauri/src/bridge/` (Rust) and `src/services/bridge/` (TypeScript).

### How `call` works

1. An agent calls the `call` tool. Rust receives the HTTP request.
2. The MCP server passes the method name and params to `Bridge::call()`.
3. The bridge generates a UUID trace ID, stores a `oneshot::Sender` in a pending map, and emits a `bridge:request` event to the webview with `{ traceId, method, params }`.
4. TypeScript receives the event, validates the payload with Zod, and passes it to the bridge dispatcher.
5. The dispatcher parses `"Queue.addToQueue"` into domain + method, looks up the `MethodMeta` (from `apiMeta` in the plugin SDK) to get the parameter order, converts named params to positional args, and calls the method on `NuclearPluginAPI`.
6. TypeScript calls `invoke('bridge_respond', { response: { traceId, status: 'success', data } })` (or `{ traceId, status: 'error', error }` on failure).
7. The bridge looks up the trace ID in the pending map and sends the response through the oneshot channel back to the original `call`.

### Timeout and error handling

The bridge times out after 30 seconds. If TypeScript doesn't respond in that window, Rust removes the pending entry and returns an error.

There are two error types:

- `InfrastructureError`: The bridge itself broke. Timeout, channel closed, event emission failed. Rust logs the error and returns it as an MCP protocol error (internal error). This means something is wrong with the bridge, not with the requested operation.
- `HandlerError`: The method ran but returned an error (e.g., "unknown domain", "playlist not found"). Rust passes this through as tool error content, which the agent can read and react to.

## Server lifecycle

`mcp_start` and `mcp_stop` are Tauri commands (not events), so the JS caller gets a `Result` back and can handle errors.

### Startup

MCP tries to bind to `localhost:8800` by default, but if that port is taken, it tries the next one up, up to 8809. If all are taken, it returns an error.

### Settings

The server can be disabled or enabled in the settings, and shows you its URL.

## How to add a new domain

1. Create the host interface, host implementation, and API class following the [host pattern](host-pattern.md).
2. Create a `yourdomain.meta.ts` file in `packages/plugin-sdk/src/mcp/` exporting a `DomainMeta`.
3. Import and register it in the `apiMeta` object in `packages/plugin-sdk/src/mcp/meta.ts`.
4. Add the domain's methods and types to `packages/player/src-tauri/src/mcp/metadata.rs` so discovery tools can serve them.
5. Update the domain list in the `list_methods` tool description string in `packages/player/src-tauri/src/mcp/tools.rs`.
