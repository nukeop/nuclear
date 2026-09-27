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
| `VideoRoot` | `mode`, `themeId` | Put it around the full composition. It sets the Nuclear theme and scales the content to the composition size. Design the layout for a 1280×720 frame. |
| `Enter` | `from`: `bottom`, `right`, or `scale` | Moves its content in at the start of its `Sequence` and fades it out at the end. |
| `Caption` | `text` | Shows a subtitle at the bottom center. |
| `Callout` | `text`, `x`, `y` | Shows a label at a position given as fractions of the frame. |
| `TitleCard` | `title`, `subtitle`, `logo` | Shows a full-frame card with the Nuclear icon. Give `logo` to show a different image, for example the full logo. |
| `VoiceOver` | `lines` | Plays each voice line `{ src, startFrame, durationInFrames }`. |
| `duckedVolume(lines, options)` | `duckedLevel`, `rampFrames` | Gives a volume function that makes music quieter while a voice line plays. |

The volume function of a media element gets frame numbers that start at the start of its `Sequence`. Give `duckedVolume` voice lines with frame numbers on the same timeline.

Components from `@nuclearplayer/ui` also work in videos. Import images from `@nuclearplayer/ui/assets/`, for example `@nuclearplayer/ui/assets/logo-full-transparent.png`.

Make all animation a function of the frame number. Use `spring`, `interpolate`, and `useCurrentFrame`.

## Structure of a feature demo

1. A `TitleCard` with the full Nuclear logo and the name of the feature, and a short voice line.
2. The OpenScreen export in an `OffthreadVideo`. Use `trimBefore` to remove the start of the take before the first action.
3. The voice lines, each at the time of its step in the event log. A `Caption` with the same text for each voice line.
4. A `Callout` with the name of the current step. Put it in an area that does not cover the zoomed element.
5. Music under the full video. Use `duckedVolume` to make it quieter during the voice lines. Fade it out when the app starts to play music.
6. The audio of the recording. Use the same `duckedVolume` function, so that the app audio is also quieter during the voice lines.
7. A `TitleCard` at the end with `nuclearplayer.com`. Start it a few seconds after the last voice line.

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
