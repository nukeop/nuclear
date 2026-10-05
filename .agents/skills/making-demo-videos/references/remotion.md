# Composing the video in Remotion

The Remotion package is `packages/videos`. Shared components are in `packages/videos/src/components`.

## Files for one video

- Put the composition in `packages/videos/src/scenarios/<Name>.tsx`. Export a `Scenario` with `id`, `component`, `durationInFrames`, `fps`, `width`, and `height`.
- Add the scenario to the `scenarios` list in `packages/videos/src/scenarios/index.ts`.
- Put the media in `packages/videos/public/<name>/`. Load it with `staticFile('<name>/<file>')`.
- Write renders to `packages/videos/out/`.

## Components

| Component | Props | Use |
|---|---|---|
| `VideoRoot` | none | Put it around the full composition. It sets the default Nuclear theme in light mode, paints the background, and scales the content to the composition size. Design the layout for a 1280×720 frame. |
| `TitleCard` | `titleLines`, `subtitle`, `backdrop` | Shows a panel with the Nuclear logo, the title, and the subtitle. The panel moves in from the left over `backdrop` and moves out at the end of its `Sequence`. Give one string for each line of the title. |
| `EndCard` | `backdrop`, `url`, `tagline` | Shows a panel that moves in from the right over `backdrop`. The URL is typed into a search field. The defaults are `nuclearplayer.com` and the platform line. |
| `Captions` | `lines` | Shows the subtitles at the bottom center. Each line is a voice line with a `text` field. The plate stays on the screen while one line follows another, and only the text changes. Long lines are divided into pages of two lines. |
| `StepMarker` | `steps`, `endFrame` | Shows the number and the label of the current step in the top-right corner, with one progress bar for each step. Each step is `{ label, startFrame }`. The marker shows from the first step until `endFrame`. |
| `Enter` | `entrance`: `drop` or `wipe`, `delay`, `exit` | Moves its content in at the start of its `Sequence` and moves it out at the end. `drop` also lifts the hard shadow of the plate. `delay` is in frames. |
| `NuclearLogo` | `className` | Shows the full Nuclear logo in the current text color. |
| `VoiceOver` | `lines` | Plays each voice line `{ src, startFrame, durationInFrames }`. |
| `duckedVolume(lines, options)` | `duckedLevel`, `downFrames`, `upFrames` | Gives a volume function that makes music quieter while a voice line plays. The defaults are 0.2, 18 frames down, and 30 frames up. |

Use one array of caption lines for `Captions`, `VoiceOver`, and `duckedVolume`. Thus the voice, the subtitles, and the ducking use the same times.

The volume function of a media element gets frame numbers that start at the start of its `Sequence`. Give `duckedVolume` voice lines with frame numbers on the same timeline.

The overlays use their own colors, borders, and hard shadows. They are white plates with black ink and a yellow accent, so that the viewer can see the difference between the overlays and the app. `VideoRoot` sets these values as CSS variables, and Tailwind classes such as `bg-video-paper`, `text-video-ink`, `bg-video-accent`, and `shadow-video-plate` use them. Overlays keep a distance from the edges of the frame. Use the `video-safe` spacing, for example `top-video-safe`.

Components from `@nuclearplayer/ui` also work in videos. Import images from `@nuclearplayer/ui/assets/`.

Make all animation a function of the frame number. Use `spring`, `interpolate`, and `useCurrentFrame`.

## Structure of a feature demo

1. A `TitleCard` with the name of the feature, and a short voice line. For `backdrop`, give the first frame of the recording in a `Freeze`, so that the title card leads into the recording.
2. The OpenScreen export in an `OffthreadVideo`. Use `trimBefore` to remove the start of the take before the first action.
3. The voice lines, each at the time of its step in the event log, in `VoiceOver`. `Captions` with the same lines.
4. A `StepMarker` with the steps of the demo. Use the times of the steps in the event log.
5. Music under the full video. Use `duckedVolume` to make it quieter during the voice lines. Fade it out when the app starts to play music.
6. The audio of the recording. Use the same `duckedVolume` function, so that the app audio is also quieter during the voice lines.
7. An `EndCard`. For `backdrop`, give the last frame of the recording in a `Freeze`. Start it a few seconds after the last voice line.

Set the composition size to the size of the OpenScreen export, and set the frame rate to 60 fps.

## Render

Bundle once. Make a still of a frame only to find a layout problem, for example a position or a size. The user reviews the full render.

```sh
cd packages/videos
npx remotion bundle --out-dir /tmp/demo-bundle
npx remotion still /tmp/demo-bundle <Id> /tmp/frame.png --frame=<frame> --scale=0.5
npx remotion render /tmp/demo-bundle <Id> out/<name>.mp4 --codec=h264 --crf=18 --audio-bitrate=256k
```

For a file size limit, make a two-pass H.264 encode at 1280×720. Calculate the video bitrate from the limit and the duration:

```sh
ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -preset slow -b:v <rate> -pass 1 -an -f mp4 /dev/null
ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -preset slow -b:v <rate> -pass 2 -c:a aac -b:a 96k -movflags +faststart small.mp4
```
