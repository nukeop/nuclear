---
description: Let AI agents control Nuclear via the Model Context Protocol.
---

# MCP Server

Nuclear includes a built-in [MCP](https://modelcontextprotocol.io/) server that lets your AI control the music player, doing pretty much anything that you can!

## Enable the server

1. Open Nuclear → Settings → Integrations.
2. Toggle `Enable MCP Server` on.
3. The server starts on `http://127.0.0.1:8800/mcp` (localhost only).

## Connect your AI tool

The server URL is `http://127.0.0.1:8800/mcp` using the `Streamable HTTP` transport.

{% tabs %}
{% tab title="Claude Code" %}
```bash
claude mcp add nuclear --transport http http://127.0.0.1:8800/mcp
```
{% endtab %}

{% tab title="OpenCode" %}
Add to your `opencode.json`:

```json
{
  "mcp": {
    "nuclear": {
      "type": "remote",
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}
```
{% endtab %}

{% tab title="Codex CLI" %}
Add to `~/.codex/config.toml`:

```toml
[mcp_servers.nuclear]
url = "http://127.0.0.1:8800/mcp"
```

Or via the CLI:

```bash
codex mcp add nuclear --url http://127.0.0.1:8800/mcp
```
{% endtab %}

{% tab title="Claude Desktop / Cursor / Windsurf" %}
Add to your MCP config (`claude_desktop_config.json`, `.cursor/mcp.json`, etc.):

```json
{
  "mcpServers": {
    "nuclear": {
      "url": "http://127.0.0.1:8800/mcp"
    }
  }
}
```
{% endtab %}

{% tab title="MCP Inspector" %}
```bash
npx @modelcontextprotocol/inspector
```

Enter `http://127.0.0.1:8800/mcp` as the URL and select `Streamable HTTP` as the transport.
{% endtab %}
{% endtabs %}

## Tools

Nuclear exposes two MCP tools. There are too many functionalities for each to have its own tool, so there's a swiss army knife-style `nuclear_api` method that can call any method by name, and a `nuclear_api_schema` that lists all available methods and their parameters.

### `nuclear_api_schema`

Returns the full list of available API methods and their parameters. Call this first to discover what you can do.

No parameters.

### `nuclear_api`

Calls a Nuclear API method by name.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `method` | string | yes | The method name (from `nuclear_api_schema`) |
| `params` | object | no | Method parameters. Omit or pass `{}` for methods with no parameters. |