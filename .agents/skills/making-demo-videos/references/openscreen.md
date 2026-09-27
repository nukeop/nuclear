# OpenScreen

OpenScreen records the screen and the audio. It exports the recording with a background, rounded corners, a smooth cursor, and zooms. Its command line interface is the app binary:

```sh
OPENSCREEN=/Applications/Openscreen.app/Contents/MacOS/Openscreen
```

All commands accept `--json` and write NDJSON events to stdout.

## Audio

Nuclear plays audio from a WebKit process. A window recording does not include audio from other processes. For this reason, the audio must go through BlackHole:

1. Make sure that BlackHole 2ch is the macOS output device and the macOS input device.
2. Record with `--mic` and `--system-audio`.

The recording contains all sounds that play on the computer, also notification sounds.

## Record

Use `scripts/openscreen.ts`. It starts the recording, gives the start time, and stops the recording when the take ends or when an error occurs:

```ts
import { Recording } from './scripts/openscreen.ts';

const recording = new Recording({
  windowTitle: 'Nuclear Music Player',
  project: 'take.openscreen',
});
const { result: events, done } = await recording.capture((startedAt) =>
  runScenario(startedAt),
);
```

- The scenario starts when OpenScreen writes the event `Recording started`. Measure the time of each event from `startedAt`.
- Keep the cursor in motion until the end of the take. OpenScreen writes a frame only when the screen changes, and the video ends at the last frame.
- The `done` event contains `screenVideoPath` and `cursorDataPath`.

The recording goes into the OpenScreen recordings directory, with a cursor file named `<video>.cursor.json` next to it. The cursor file contains each click with its time and position. `$OPENSCREEN sources --json` lists the windows that OpenScreen can record.

## Edit the project

The project file is JSON with `version`, `media`, and `editor`. Change the fields in `editor`:

| Field | Value |
|---|---|
| `aspectRatio` | `"16:9"` |
| `exportQuality` | `"source"` |
| `padding` | `8` for a thin frame of background, `0` for no frame |
| `borderRadius` | `12` |
| `wallpaper` | absolute path of the background image |
| `zoomRegions` | list of zooms, see below |

The export lays out each recording as 16:9. Record a 16:9 window and set `aspectRatio` to `"16:9"`. Then the export has the size of the recording, 2880×1620.

Each point of `padding` makes the recording 0.4% smaller. For example, `padding: 8` makes it 3.2% smaller. At `0`, the export shows the recording at its original size.

## Add zooms

A zoom region has this format:

```json
{ "id": "zoom-1", "startMs": 7400, "endMs": 16400, "depth": 1, "focus": { "cx": 0.5, "cy": 0.52 } }
```

- Make one zoom for each action that the viewer must see closely, for example a dialog or a menu.
- Start the zoom about half a second before the click. End it after the result shows.
- Set `focus` to the click position from the event log, as a fraction of the window size.
- Use `depth: 1` for a small zoom and `depth: 2` for a large zoom.

The focus stays at one point during the zoom.

## Export

```sh
$OPENSCREEN export take.openscreen -o screen.mp4 --json
```

The export is H.264 at 60 fps. The audio in the export is approximately 7 dB quieter than in the recording. Give the export file directly to Remotion.
