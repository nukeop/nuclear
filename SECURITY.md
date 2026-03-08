# Security

## Reporting a vulnerability

Please don't open a public GitHub issue for security bugs.

Use [GitHub Security Advisories](https://github.com/gabrielbrandao/nuclear/security/advisories/new) to report privately. I'll respond as soon as I can and work on a fix. Once a fix is out, public disclosure is fine.

Include:
- what you found
- steps to reproduce
- the potential impact

## Scope

Main areas of concern:

- Tauri command injection or privilege escalation
- MCP server auth bypass or SSRF
- Plugin sandbox escape or arbitrary code execution via plugin install
- XSS in the renderer that can reach Tauri commands or the MCP API
- Remote code execution through auto-update or plugin install
- Sensitive data exposure through logs or network traffic
- Path traversal in file operations (zip extraction, directory copy, downloads)

## Out of scope

- Self-XSS (you'd have to attack yourself)
- Issues requiring physical access to the machine
- Vulnerabilities in upstream dependencies that are already tracked upstream

## Architecture notes for researchers

- **MCP server** runs on `127.0.0.1` only. It requires an `x-mcp-token` header for every request. The token is generated at server start and stored in app settings.
- **Plugin system** runs plugin JS via `new Function()` with a sandboxed `require()`. Plugins can't import Node built-ins or arbitrary modules, but they do get access to the full player API (queue, playback, HTTP, etc).
- **Tauri commands** (`copy_dir_recursive`, `extract_zip`, `download_file`, `http_fetch`) validate URLs and paths but are still relatively powerful from a compromised renderer.
- **CSP** is set on the renderer. `unsafe-inline` is allowed for styles (needed for themes). WASM eval is allowed for the plugin compiler.
