const config = {
  binary: '/Applications/Openscreen.app/Contents/MacOS/Openscreen',
  startedMessage: 'Recording started',
};

type OpenScreenEvent = {
  event: string;
  message?: string;
  screenVideoPath?: string;
  cursorDataPath?: string;
};

type RecordOptions = {
  windowTitle: string;
  project: string;
};

const parseLines = async function* (stream: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const chunk of stream) {
    buffer += decoder.decode(chunk);
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    yield* lines.filter(Boolean);
  }
};

export class Recording {
  readonly events: OpenScreenEvent[] = [];
  readonly startedAt: Promise<number>;
  readonly #process;
  readonly #output: Promise<void>;

  constructor({ windowTitle, project }: RecordOptions) {
    this.#process = Bun.spawn(
      [
        config.binary,
        'record',
        '--window',
        windowTitle,
        '--mic',
        '--system-audio',
        '--project',
        project,
        '--json',
      ],
      { stdin: 'pipe', stdout: 'pipe', stderr: 'ignore' },
    );
    const { promise, resolve } = Promise.withResolvers<number>();
    this.startedAt = promise;
    this.#output = this.#read(resolve);
  }

  async #read(onStarted: (at: number) => void) {
    for await (const line of parseLines(this.#process.stdout)) {
      const event: OpenScreenEvent = JSON.parse(line);
      this.events.push(event);
      if (event.message === config.startedMessage) {
        onStarted(Date.now());
      }
    }
  }

  async stop() {
    this.#process.stdin.write('stop\n');
    this.#process.stdin.end();
    await this.#process.exited;
    await this.#output;
    return this.events.find((event) => event.event === 'done');
  }

  async capture<Result>(take: (startedAt: number) => Promise<Result>) {
    const startedAt = await this.startedAt;
    const result = await take(startedAt).catch(async (error) => {
      await this.stop();
      throw error;
    });
    return { result, done: await this.stop() };
  }
}
