---
description: Control Nuclear from any MPD client.
---

# MPD server

Nuclear includes a built-in [MPD](https://www.musicpd.org/)-compatible server. If you already use tools like `mpc`, `ncmpcpp`, `mpDris2`, or any other MPD client, you can use them with Nuclear and control playback.

Nuclear supports the subset of the protocol needed for playback control, queue management, and real-time notifications. Library browsing and stored playlists are not yet supported.

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
| `status`         | Volume, playback state, repeat/random/single mode, queue length, current song position, elapsed/duration. |
| `currentsong`    | Title, artist, album, position, and duration of the current track. |
| `playlistinfo`   | List all queue items, a single position, or a range. |

### Playback

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `play [POS]`         | Resume playback, or jump to a queue position.    |
| `pause [0\|1]`       | Pause, resume, or toggle.                        |
| `stop`               | Stop playback.                                   |
| `next`               | Skip to the next track.                          |
| `previous`           | Go back to the previous track.                   |
| `seek SONGPOS TIME`  | Seek to TIME seconds in the song at queue position SONGPOS. Jumps to that position if it differs from the current one. |
| `seekid SONGID TIME` | Same as `seek` (song IDs equal queue positions). |
| `seekcur TIME`       | Seek within the current song. TIME can be absolute (`30`), or relative (`+10`, `-5`). |

### Queue

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `delete [POS\|START:END]` | Remove a song by position, or a range of songs. |
| `deleteid SONGID`    | Remove a song by ID (same as position).          |
| `move FROM TO`       | Move a song from one position to another.        |
| `clear`              | Clear the queue.                                 |

### Volume

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `setvol VOL`     | Set volume (0-100). Values outside the range are clamped. |
| `getvol`         | Get current volume.                              |

### Playback options

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `repeat 0\|1`   | Enable or disable repeat mode.                   |
| `random 0\|1`   | Enable or disable shuffle.                       |
| `single 0\|1`   | Enable repeat-one (`1`) or turn it off (`0`).    |

### Idle and notifications

| Command                      | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `idle [SUBSYSTEM ...]`       | Block until one of the listed subsystems changes. If no subsystems are given, listen for all. Responds with `changed: <subsystem>` lines. |
| `noidle`                     | Cancel a pending `idle` and return to the command loop. |

Supported subsystems:

| Subsystem    | Fires when                                       |
| ------------ | ------------------------------------------------ |
| `player`     | Playback state changes (play/pause/stop) or the current track changes. |
| `playlist`   | The queue contents change (tracks added, removed, or reordered). |
| `mixer`      | Volume changes.                                  |
| `options`    | Repeat, random, or single mode changes.          |

{% hint style="info" %}
`idle` is what lets MPD clients like `ncmpcpp` update in real time without polling. Most polybar/waybar/eww MPD modules also rely on it.
{% endhint %}

### Connection

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `ping`           | Test the connection.                             |
| `close`          | Close the connection.                            |
| `password`       | Accepted but ignored (no authentication).        |

### Command lists

The server supports `command_list_begin`, `command_list_ok_begin`, and `command_list_end` for batching multiple commands. `idle` is not allowed inside command lists.
