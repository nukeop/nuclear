---
description: Let AI agents control Nuclear via the Model Context Protocol.
---

# MCP server

Nuclear includes a built-in [MCP](https://modelcontextprotocol.io/) server that lets your AI control the music player, doing pretty much anything that you can!

## Enable the server

1. Open Nuclear → Settings → Integrations.
2. Toggle `Enable MCP Server` on.
3. The server starts on `http://127.0.0.1:8800/mcp` (localhost only). If port 8800 is taken, it tries 8801, 8802, and so on up to 8809.
4. The **MCP Server URL** field below the toggle shows the actual URL. Click the copy button to grab it.

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

Nuclear exposes four MCP tools. The server uses a hierarchical discovery pattern: start broad, drill down, then act.

### `list_methods`

Lists available methods in a domain.

| Parameter | Type   | Required | Description                                                                                                            |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `domain`  | string | yes      | One of: `Queue`, `Playback`, `Metadata`, `Favorites`, `Playlists`, `Dashboard`, `Providers`. |

Returns the method names and short descriptions for that domain.

### `method_details`

Gets full details for a single method: its description, parameter names and types, and return type.

| Parameter | Type   | Required | Description                                                       |
| --------- | ------ | -------- | ----------------------------------------------------------------- |
| `method`  | string | yes      | The method name in `Domain.method` format, e.g. `Queue.addToQueue`. |

### `describe_type`

Gets the JSON shape of a data type. Use this when `method_details` returns a parameter or return type that references a complex type.

| Parameter | Type   | Required | Description                                          |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `type`    | string | yes      | The type name, e.g. `Track`, `QueueItem`, `Playlist`. |

### `call`

Calls a Nuclear API method.

| Parameter | Type   | Required | Description                                                                                    |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------- |
| `method`  | string | yes      | The method name in `Domain.method` format, e.g. `Queue.addToQueue`.                              |
| `params`  | object | no       | A JSON object with named fields matching the method's parameters. Omit or pass `{}` for methods with no parameters. |

## Discovery workflow

An agent follows this sequence to find and call an API method:

1. Read the `list_methods` tool description to see the seven available domains.
2. Call `list_methods` with a domain (e.g. `Queue`) to see that domain's methods.
3. Call `method_details` (e.g. `Queue.addToQueue`) to get parameter names, types, and the return type.
4. If a parameter or return type is a complex type like `Track`, call `describe_type` to see its fields.
5. Call `call` with the method name and parameters to execute it.

Each step returns a small, focused payload to save on tokens.

## Agent skill

If your AI tool supports skills (like Claude Code), you can install one that teaches the agent how to use Nuclear's MCP tools, including the discovery workflow, common recipes, and the full API reference.

[Download nuclear-mcp.zip](/skills/nuclear-mcp.zip)

Unzip it into your skills directory (e.g. `~/.claude/skills/`) and the agent will pick it up automatically.