# Background music

## Models

| Model | Inputs | Output |
|---|---|---|
| `google/lyria-2` | `prompt`, `negative_prompt`, `seed` | About 33 seconds, 48 kHz stereo. The best quality. |
| `elevenlabs/music` | `prompt`, `music_length_ms`, `force_instrumental`, `output_format` | Any length. Lower quality than Lyria 2. |

Use Lyria 2. Use ElevenLabs Music only when the video needs one continuous piece that is longer than Lyria 2 can make.

## Style

The music is calm, instrumental background music that stays under the voice. Describe the genre, the instruments, the mood, and the tempo. Example prompt for Lyria 2:

- `prompt`: "Calm modern chillhop background for a product demo: soft Rhodes, gentle synth pads, clean punchy kick and snare, warm bass, bright and optimistic, no vocals"
- `negative_prompt`: "vocals, singing, harsh distortion"

## Procedure

1. Generate two or three pieces with different prompts or seeds. Let the user select one.
2. For a video that is longer than one piece, generate more pieces with the same prompt, and join them with a crossfade:

   ```sh
   ffmpeg -i first.wav -i second.wav -filter_complex "[0][1]acrossfade=d=3" joined.wav
   ```

3. Set the loudness to about -20 LUFS:

   ```sh
   ffmpeg -i joined.wav -af "loudnorm=I=-20:TP=-2" -ar 48000 music.wav
   ```

4. In Remotion, make the music quieter during the voice lines with `duckedVolume`. A `duckedLevel` of 0.35 with a `rampFrames` of 8 keeps the voice clear.
