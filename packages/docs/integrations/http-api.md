---
description: Control Nuclear from scripts and other tools via the HTTP API.
---

# HTTP API

When Nuclear Jam is enabled, Nuclear exposes a local HTTP API on the same server that serves the remote control UI. You can use it to build your own integrations, scripts, or alternative remotes.

Enable Nuclear Jam in Settings, then Integrations. The **API URL** field shows the base URL (e.g. `http://192.168.1.42:4120/api`).

## Endpoints

### State

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/health` | `{ "status": "ok" }` |
| GET | `/api/queue` | `{ "items": QueueItem[], "currentIndex": number }` |
| GET | `/api/playback` | `{ "status": string, "seek": number, "duration": number }` |
| GET | `/api/settings` | `{ "shuffle": boolean, "repeat": string, "discovery": boolean, "language": string, "dark": boolean, "themeId": string }` |
| GET | `/api/settings/{id}` | The value of a single setting by its fully-qualified ID (e.g. `core.playback.shuffle`) |

### Actions

All action endpoints return `200 OK` with no body on success.

| Method | Path | Body | Effect |
|--------|------|------|--------|
| POST | `/api/playback/toggle` | none | Toggle play/pause |
| POST | `/api/playback/next` | none | Skip to next track |
| POST | `/api/playback/previous` | none | Go to previous track |
| POST | `/api/playback/seek` | `{ "seconds": number }` | Seek to position |
| POST | `/api/playback/shuffle` | `{ "enabled": boolean }` | Set shuffle on or off |
| POST | `/api/playback/repeat` | `{ "mode": "off" \| "all" \| "one" }` | Set repeat mode |
| POST | `/api/settings/{id}` | JSON value | Set a single setting by its fully-qualified ID |

### Events (SSE)

`GET /api/events` opens a Server-Sent Events stream. The server pushes named events whenever state changes in Nuclear.

Three event types:

{% code title="queue" %}
```
event: queue
data: {"items":[...],"currentIndex":3}
```
{% endcode %}

{% code title="playback" %}
```
event: playback
data: {"status":"playing","seek":42.1,"duration":213.0}
```
{% endcode %}

{% code title="settings" %}
```
event: settings
data: {"shuffle":false,"repeat":"off","discovery":false,"language":"en_US","dark":false,"themeId":"default"}
```
{% endcode %}

Events carry the full state for their domain in JSON.

## Errors

Failed requests return a JSON body with an `error` field:

```json
{ "error": "Playback.toggle failed: no track in queue" }
```

The status code is `500` for bridge errors (the command reached Nuclear but failed) and standard HTTP codes for anything else (404 for unknown routes, etc.).
