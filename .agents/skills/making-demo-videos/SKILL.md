---
name: making-demo-videos
description: Use when making a demo, tutorial, or feature video of Nuclear. Covers driving the app with WebDriver and real cursor input, recording with OpenScreen, generating voiceover, music, background images, and Nuki mascot images, and composing the video in Remotion (packages/videos).
---

# Making demo videos

A demo video shows one or more features of Nuclear. You drive the app in a demo profile and record it with OpenScreen. Then you add a title card, captions, step labels, a voiceover, and music in Remotion.

## Requirements

- macOS with a Retina display.
- Accessibility and Screen Recording permissions for the app that runs you.
- OpenScreen in `/Applications/Openscreen.app`.
- Bun and ffmpeg.
- A Replicate API token in `REPLICATE_API_TOKEN` and an OpenRouter API key in `OPENROUTER_API_KEY`.
- BlackHole 2ch as the macOS output device and input device during each take. See [openscreen.md](references/openscreen.md).
- Nuclear running with the demo profile. The user starts it with `pnpm dev -- -- -- --profile demo` in the repository root.

## Procedure

1. Plan the video. Write the steps of the feature, one voice line for each step, and a label for each step. See [voice.md](references/voice.md).
2. Generate the voice lines, the music, and the background image. See [voice.md](references/voice.md), [music.md](references/music.md), and [images.md](references/images.md).
3. Set up the window and add the WebDriver plugin. See [recording.md](references/recording.md).
4. Write the scenario script. Run it without recording until it runs correctly. See [recording.md](references/recording.md).
5. Record the take with OpenScreen while the scenario runs. See [openscreen.md](references/openscreen.md).
6. Add zooms, the background, and the frame to the OpenScreen project. Export it. See [openscreen.md](references/openscreen.md).
7. Compose the video in Remotion and render it. Give the render to the user for review. See [remotion.md](references/remotion.md).
8. Remove the WebDriver plugin.

## Screen control

Before you use the screen, mouse, or keyboard:

1. Ask the user for permission. Wait for the answer.
2. Run `bun scripts/screen-control.ts start`. It shows a notification, plays a sound, and waits 5 seconds.

When you no longer need the screen, run `bun scripts/screen-control.ts stop`. It shows a notification and plays a different sound.

Keep each period of screen control short. Do generation, export, and render work after `stop`.

## Media review

The user decides about all media quality: voices, music, images, the loudness and clarity of the voiceover, the balance of voice and music, and the final video. Generate samples, variants, and renders into `packages/videos/out/`, then ask the user to review them. Make the loudness of audio samples the same before the user compares them.

## Scripts

| Script | Use |
|---|---|
| `scripts/screen-control.ts start\|stop` | Signals the user before and after screen control. |
| `scripts/webdriver-plugin.ts add\|remove` | Adds or removes the local WebDriver plugin. |
| `scripts/webdriver.ts` | Finds elements by CSS selector or by text, with screen coordinates. |
| `scripts/input.ts` | Moves the cursor with easing, clicks, scrolls, and types with real macOS events. |
| `scripts/openscreen.ts` | Records a take with OpenScreen and gives the start time. |
| `scripts/replicate.ts` | Runs Replicate models and downloads the output. |
| `scripts/gemini-tts.ts` | Generates voice lines with Gemini TTS on OpenRouter. |

Run the scripts with `bun`.
