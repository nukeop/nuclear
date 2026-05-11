---
description: Control Nuclear from any MPD client.
---

# MPD server

Nuclear includes a built-in [MPD](https://www.musicpd.org/)-compatible server. If you already use tools like `mpc`, `ncmpcpp`, `mpDris2`, or any other MPD client, you can use them with Nuclear and control playback.

Nuclear supports the subset of the protocol needed for playback control, queue inspection, and status reporting. Library browsing, stored playlists, and queue manipulation from the client side are not supported.

## Enable the server

1. Open Nuclear, then go to Settings, then Integrations.
2. Toggle **Enable MPD Server** on.
3. The server starts on `127.0.0.1:6600` (localhost only). If port 6600 is taken, it tries 6601, 6602, and so on up to 6609.
4. The **MPD Server URL** field below the toggle shows the bound address. Click the copy button to grab it.

## Connect a client

If Nuclear was able to bind to port 6600, which is the default port for this protocol, all tools will see it out of the box. Example with mpc:

{% tabs %}
{% tab title="mpc" %}
If Nuclear got port 6600, `mpc` connects with no configuration:

```bash
mpc status
```

If Nuclear bound to a different port (check the settings field), set the `MPD_HOST` and `MPD_PORT` environment variables:

```bash
export MPD_HOST=127.0.0.1
export MPD_PORT=6601
mpc status
```
{% endtab %}

{% tab title="ncmpcpp" %}
Edit `~/.config/ncmpcpp/config`:

```
mpd_host = 127.0.0.1
mpd_port = 6600
```

Adjust the port if Nuclear bound to a different one.
{% endtab %}

{% tab title="Other clients" %}
Use `127.0.0.1` on the port shown in Nuclear's settings. No password is required.
{% endtab %}
{% endtabs %}

## Supported commands

### Status and metadata

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `status`         | Volume, playback state, repeat/single mode, queue length, current song position, elapsed/duration. |
| `currentsong`    | Title, artist, album, position, and duration of the current track. |
| `playlistinfo`   | List all queue items, a single position, or a range. |

### Playback

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `play [POS]`     | Resume playback, or jump to a queue position.    |
| `pause [0\|1]`   | Pause, resume, or toggle.                        |
| `stop`           | Stop playback.                                   |
| `next`           | Skip to the next track.                          |
| `previous`       | Go back to the previous track.                   |

### Volume

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `setvol VOL`     | Set volume (0-100). Values outside the range are clamped. |
| `getvol`         | Get current volume.                              |

### Connection

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `ping`           | Test the connection.                             |
| `close`          | Close the connection.                            |
| `password`       | Accepted but ignored (no authentication).        |

### Command lists

The server supports `command_list_begin`, `command_list_ok_begin`, and `command_list_end` for batching multiple commands.
