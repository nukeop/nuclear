---
description: How the MCP server works internally and how to extend it.
---

# MCP Architecture

Nuclear's MCP server lets your AI control the music player and do anything that plugins can do!

## Architecture overview

Tauri's Rust process hosts an HTTP server that implements the MCP protocol using the `rmcp` crate. It communicates with the frontend layer where all the application logic lives.

## The bridge protocol

Rust and TS communicate via a request/response pattern with trace IDs:

1. Agent calls a tool.
2. Rust receives it over HTTP.
3. Rust generates a trace ID, emits an `mcp:tool-call` event to the webview.
4. TS looks up the method, calls the plugin API, gets a result.
5. TS calls `invoke('mcp_respond', { response: { traceId, success, data } })`.
6. Rust matches the trace ID and resolves the pending request.

Timeout is 30 seconds. There are two error types:
- `InfrastructureError` (bridge broke - logged, reported as protocol error)
- `ToolError` (method returned an error - passed through to the agent)