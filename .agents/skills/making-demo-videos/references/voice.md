# Voiceover

## Models

| Model | Voice settings |
|---|---|
| `google/gemini-3.1-flash-tts` | `voice` (for example `Kore` or `Aoede`), `prompt` with style instructions |
| `elevenlabs/v3` | `voice` (for example `Sarah`), `stability` 0.8, `style` 0 |

Gemini gives the most natural speech. ElevenLabs gives consistent speech. Female voices give the best results with both models. Before you use a model, examine its current inputs with `inputSchema(model)` from `scripts/replicate.ts`.

## Style

The voice is calm, friendly, and clear, like a person who shows a colleague how to use the app. For Gemini, write this in the `prompt`, for example: "Read this like a calm, friendly product walkthrough. Natural and unhurried."

## Text

Write one voice line for each step of the scenario. Each line tells the viewer what happens on the screen, in plain words. Use the names of the UI elements as the app shows them. Example:

> Open Playlists from the sidebar, and select Create new.

Keep each line shorter than its step in the take.

## Procedure

1. Write the voice lines.
2. Generate one audio file for each line, so that you can put each line at its step.
3. For a new voice or model, generate the same line with some voices. Let the user select the voice.
4. Make the loudness of each file the same:

   ```sh
   ffmpeg -i line.wav -af "loudnorm=I=-15:TP=-1.5:LRA=7" -ar 48000 line-normalized.wav
   ```

5. Let the user listen to the lines. Generate a line again if the user asks for it.
