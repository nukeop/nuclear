---
description: Make CORS-free HTTP requests from plugins using a standard fetch API.
---

# HTTP

## HTTP API for plugins

Desktop apps can make HTTP requests without CORS restrictions, but plugin code runs in a browser context. The HTTP API bridges this gap by routing plugin requests through Tauri's native HTTP client.

Use `api.Http.fetch` instead of the browser's `fetch` whenever you need to call external APIs from a plugin.

{% hint style="info" %}
Access HTTP via `api.Http.fetch(url, init)` in your plugin's lifecycle hooks. The signature matches the standard [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
{% endhint %}

---

## Usage

{% tabs %}
{% tab title="GET request" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const response = await api.Http.fetch(
      'https://api.example.com/tracks?q=radiohead'
    );

    if (response.ok) {
      const data = await response.json();
      api.Logger.info(`Found ${data.results.length} tracks`);
    }
  },
};
```
{% endtab %}

{% tab title="POST request" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onEnable(api: NuclearPluginAPI) {
    const response = await api.Http.fetch('https://api.example.com/scrobble', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist: 'Radiohead',
        track: 'Paranoid Android',
      }),
    });

    if (!response.ok) {
      api.Logger.error(`Scrobble failed: ${response.status}`);
    }
  },
};
```
{% endtab %}
{% endtabs %}

---

## How it works

When you call `api.Http.fetch(url, init)`:

1. The SDK extracts the URL, method, headers, and body from the standard `RequestInit`
2. Headers are flattened to a plain `Record<string, string>` and the body is read as a string
3. The host makes the request through Tauri's native HTTP client (no CORS)
4. The response comes back as raw data (status, headers, body string)
5. The SDK wraps it into a standard `Response` object and returns it

This means you can use the response exactly like a normal `fetch` response: call `.json()`, `.text()`, check `.ok` and `.status`, read `.headers`, and so on.

---

## Limitations

- **String bodies only.** Request bodies must be strings. If you pass `FormData`, `Blob`, `ArrayBuffer`, or other non-string types, the body is silently dropped. Serialize to a string (e.g., `JSON.stringify`) before sending.
- **Headers are flattened.** The SDK converts headers to `Record<string, string>`. Multi-value headers (e.g., multiple `Set-Cookie` values) are not preserved.

---

## Reference

```typescript
api.Http.fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
```

The signature matches the standard `fetch` function. Refer to [MDN's Fetch API docs](https://developer.mozilla.org/en-US/docs/Web/API/fetch) for `RequestInit` options.
