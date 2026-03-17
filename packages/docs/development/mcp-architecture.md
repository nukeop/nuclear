---
description: How the MCP server works internally and how to extend it.
---

# MCP architecture

Nuclear's [MCP](https://modelcontextprotocol.io/) server lets your AI control the music player and do anything that plugins can do!

The server runs on `localhost:8800/mcp` using the Streamable HTTP transport.

## The four MCP tools

Rust defines four tools in `tools.rs`. No business logic lives in Rust. These tools reuse the same API as plugins.

| Tool | Purpose | Arguments |
|------|---------|-----------|
| `list_methods` | List methods in a domain | `{ domain: "Queue" }` |
| `method_details` | Get parameter names, types, return type for a method | `{ method: "Queue.addToQueue" }` |
| `describe_type` | Get the JSON shape of a data type (Track, QueueItem, etc.) | `{ type: "Track" }` |
| `call` | Execute a method | `{ method: "Queue.addToQueue", params: { tracks: [...] } }` |

The first three are discovery tools. Agents use them to figure out what's available before calling anything. The TS handler serves these from static metadata objects (`apiMeta` and `typeRegistry` from `@nuclearplayer/plugin-sdk/mcp`).

The `call` tool runs through the dispatcher, which converts named parameters to positional arguments and calls the API method.

## The Rust/JS bridge protocol

Rust and JS communicate through Tauri's event system with a request/response pattern correlated by trace IDs.

### Request flow

1. An agent calls a tool. Rust receives the HTTP request.
2. Rust generates a UUID trace ID, stores a `oneshot::Sender` in a `HashMap<String, Sender>`, and emits an `mcp:tool-call` event to the webview with `{ traceId, toolName, arguments }`.
3. JS receives the event, validates the payload with Zod, and routes to the appropriate handler.
4. For `list_methods`, `method_details`, and `describe_type`: JS looks up the answer in `apiMeta` or `typeRegistry`. No API call happens.
5. For `call`: the dispatcher parses `"Queue.addToQueue"` into domain + method, looks up the `MethodMeta` to get the parameter order, converts the named params object into positional args, and calls the method on `NuclearPluginAPI`.
6. JS calls `invoke('mcp_respond', { response: { traceId, success, data } })` (or `{ traceId, success: false, error }` on failure).
7. Rust receives the `mcp_respond` command, looks up the trace ID in the pending map, and sends the response through the oneshot channel. The original `call_tool` function was awaiting this channel and now returns the result to the HTTP response.

### Timeout and error handling

The bridge times out after 30 seconds. If JS doesn't respond in that window, Rust removes the pending entry and returns an error.

There are two error types:

- `InfrastructureError`: The bridge itself broke. Timeout, channel closed, event emission failed. Rust logs the error and returns it as an MCP protocol error (internal error). This means something is wrong with the bridge, not with the requested operation.
- `ToolError`: The method ran but returned an error (e.g., "unknown domain", "playlist not found"). Rust passes this through as tool error content, which the agent can read and react to.

## Server lifecycle

`mcp_start` and `mcp_stop` are Tauri commands (not events), so the JS caller gets a `Result` back and can handle errors.

### Startup

MCP tries to bind to `localhost:8800` by default, but if that port is taken, it tries the next one up, up to 8809. If all are taken, it returns an error.

### Settings

The server can be disabled or enabled in the settings, and shows you its URL.

### Metadata types

Defined in `meta.ts`:

```typescript
type ParamMeta = {
  name: string;
  type: string;
};

type MethodMeta = {
  name: string;
  description: string;
  params: ParamMeta[];
  returns: string;
};

type DomainMeta = {
  description: string;
  methods: Record<string, MethodMeta>;
};
```

Each domain has a `*.meta.ts` file (e.g., `queue.meta.ts`) that exports a `DomainMeta` object. The `apiMeta` object in `meta.ts` aggregates all domain metadata by importing these files.

The `typeRegistry` in `typeRegistry.ts` maps type names (like `"Track"`, `"QueueItem"`) to their field definitions so agents can call `describe_type` and understand the data shapes.

## How to add a new domain

1. Create the host interface, host implementation, and API class following the [host pattern](host-pattern.md).
2. Create a `yourdomain.meta.ts` file in `packages/plugin-sdk/src/mcp/` exporting a `DomainMeta`.
3. Import and register it in the `apiMeta` object in `packages/plugin-sdk/src/mcp/meta.ts`.
4. Update the domain list in the `list_methods` tool description string in `packages/player/src-tauri/src/mcp/tools.rs`. This is the only Rust change needed when adding a domain.