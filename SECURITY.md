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

## Architecture notes

- **MCP server** binds to `127.0.0.1` only, requires `x-mcp-token` header on every request. Token is generated at server start and stored in app settings.
- **Plugin system** runs plugin JS via `new Function()` with a sandboxed `require()`. Plugins can't import arbitrary modules but do get access to the full player API (queue, playback, HTTP, etc).
- **Tauri commands** (`copy_dir_recursive`, `extract_zip`, `download_file`, `http_fetch`) validate URLs and paths but are still fairly powerful if the renderer is compromised.
- **CSP** is set on the webview. `unsafe-inline` is allowed for styles (needed for themes). `wasm-unsafe-eval` is allowed for the plugin compiler.
