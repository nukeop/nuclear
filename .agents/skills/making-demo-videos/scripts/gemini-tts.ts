import { $ } from 'bun';

const config = {
  speechUrl: 'https://openrouter.ai/api/v1/audio/speech',
  model: 'google/gemini-3.8-flash-tts',
  pcmSampleRate: 24000,
  outputSampleRate: 48000,
  requestTimeoutMs: 90 * 1000,
};

type GenerateSpeechOptions = {
  text: string;
  voice: string;
  instructions: string;
  path: string;
};

export const generateSpeech = async ({
  text,
  voice,
  instructions,
  path,
}: GenerateSpeechOptions) => {
  const response = await fetch(config.speechUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Bun.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      input: text,
      voice,
      instructions,
      response_format: 'pcm',
    }),
    signal: AbortSignal.timeout(config.requestTimeoutMs),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }
  const pcm = `${path}.pcm`;
  await Bun.write(pcm, await response.arrayBuffer());
  await $`ffmpeg -y -loglevel error -f s16le -ar ${config.pcmSampleRate} -ac 1 -i ${pcm} -ar ${config.outputSampleRate} ${path}`;
  await $`rm ${pcm}`;
  return path;
};
