# Voiceover

## Model

Use `google/gemini-3.8-flash-tts` on OpenRouter with the voice `Aoede`. Use `generateSpeech()` from `scripts/gemini-tts.ts`. It reads the key from `OPENROUTER_API_KEY` and writes a 48 kHz WAV file:

```ts
import { generateSpeech } from './scripts/gemini-tts.ts';

await generateSpeech({
  text: 'Open Playlists from the sidebar, and select Create new.',
  voice: 'Aoede',
  instructions: 'Read this like a calm, friendly product walkthrough. Natural and unhurried.',
  path: 'voice/create.wav',
});
```

The model gives raw PCM at 24 kHz, 16 bit, mono. `generateSpeech()` converts it to WAV.

If OpenRouter returns error 404 with the text "guardrail restrictions and data policy", the privacy settings of the account stop the requests to the model. Tell the user to change the OpenRouter privacy settings so that they accept the model endpoint.

## Style

The voice is calm, friendly, and clear, like a person who shows a colleague how to use the app. Write this in `instructions`.

## Text

Write one voice line for each step of the scenario. Each line tells the viewer what occurs on the screen, in simple words. Use the names of the UI elements as the app shows them. Example:

> Open Playlists from the sidebar, and select Create new.

Keep each line shorter than its step in the take.

## Procedure

1. Write the voice lines.
2. Generate one audio file for each line, so that you can put each line at its step.
3. Make the loudness of each file the same:

   ```sh
   ffmpeg -i line.wav -af "loudnorm=I=-15:TP=-1.5:LRA=7" -ar 48000 line-normalized.wav
   ```

4. Let the user listen to the lines. Generate a line again when the user tells you to.
5. Measure the length of each file. Use the lengths to set the pauses in the scenario.
