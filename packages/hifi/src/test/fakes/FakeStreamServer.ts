import { Fmp4Track } from '../builders/Fmp4TrackBuilder';

export type RecordedRequest = {
  url: string;
  startByte: number;
  endByte: number;
};

type FakeResponse = {
  ok: boolean;
  status: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
};

type Responder = (
  request: RecordedRequest,
  options: RequestInit,
) => Promise<FakeResponse>;

const parseByteRange = (
  options: RequestInit,
): { startByte: number; endByte: number } => {
  const rangeHeader = (options.headers as Record<string, string>).Range;
  const match = rangeHeader.match(/bytes=(\d+)-(\d+)/)!;
  return {
    startByte: parseInt(match[1], 10),
    endByte: parseInt(match[2], 10),
  };
};

const hangUntilAborted = (signal: RequestInit['signal']): Promise<never> =>
  new Promise((_resolve, reject) => {
    signal?.addEventListener('abort', () => reject(signal.reason));
  });

const respondWithBytes = (bytes: Uint8Array): FakeResponse => ({
  ok: true,
  status: 206,
  arrayBuffer: async () => bytes.buffer as ArrayBuffer,
  text: async () => new TextDecoder().decode(bytes),
});

const errorResponse = (status: number): FakeResponse => {
  const message = `Streaming service returned error: ${status}`;
  return {
    ok: false,
    status,
    arrayBuffer: async () =>
      new TextEncoder().encode(message).buffer as ArrayBuffer,
    text: async () => message,
  };
};

export class FakeStreamServer {
  constructor(private readonly track: Fmp4Track) {}

  private readonly serveFromTrack: Responder = async (request) =>
    respondWithBytes(
      this.track.bytesForRange(request.startByte, request.endByte),
    );

  private responder = vi.fn(this.serveFromTrack);

  setup(): void {
    this.responder = vi.fn(this.serveFromTrack);
    vi.stubGlobal('fetch', (url: string, options: RequestInit) =>
      this.handleRequest(url, options),
    );
  }

  teardown(): void {
    vi.unstubAllGlobals();
  }

  get requests(): RecordedRequest[] {
    return this.responder.mock.calls.map(([request]) => request);
  }

  get headerRequests(): RecordedRequest[] {
    return this.requests.filter((request) => request.startByte === 0);
  }

  get segmentRequests(): RecordedRequest[] {
    return this.requests.filter((request) => request.startByte !== 0);
  }

  requestCountForSegment(segmentIndex: number): number {
    const { startByte, endByte } = this.track.byteRangeForSegment(segmentIndex);
    return this.requests.filter(
      (request) =>
        request.startByte === startByte && request.endByte === endByte,
    ).length;
  }

  clearRequestLog(): void {
    this.responder.mockClear();
  }

  failNextRequest(status: number): void {
    this.responder.mockImplementationOnce(async () => errorResponse(status));
  }

  failAllRequests(status: number): void {
    this.responder.mockImplementation(async () => errorResponse(status));
  }

  succeedNextRequest(): void {
    this.responder.mockImplementationOnce(this.serveFromTrack);
  }

  hangNextRequest(): void {
    this.responder.mockImplementationOnce((_request, options) =>
      hangUntilAborted(options.signal),
    );
  }

  corruptNextResponse(): void {
    this.responder.mockImplementationOnce(async (request) =>
      respondWithBytes(new Uint8Array(request.endByte - request.startByte + 1)),
    );
  }

  holdNextRequest(): () => void {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.responder.mockImplementationOnce(async (request, options) => {
      await gate;
      return this.serveFromTrack(request, options);
    });
    return release;
  }

  private async handleRequest(
    url: string,
    options: RequestInit,
  ): Promise<FakeResponse> {
    const { startByte, endByte } = parseByteRange(options);
    const request: RecordedRequest = { url, startByte, endByte };
    return this.responder(request, options);
  }
}
