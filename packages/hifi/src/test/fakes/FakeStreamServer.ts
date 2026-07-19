import { Fmp4Track } from '../builders/Fmp4TrackBuilder';

export type RecordedRequest = {
  url: string;
  startByte: number;
  endByte: number;
};

type FakeResponse = {
  ok: boolean;
  status: number;
  arrayBuffer?: () => Promise<ArrayBuffer>;
  text?: () => Promise<string>;
};

type ResponseOverride = (
  startByte: number,
  endByte: number,
  options?: RequestInit,
) => Promise<FakeResponse>;

function parseByteRange(options?: RequestInit): {
  startByte: number;
  endByte: number;
} {
  const rangeHeader = (options!.headers as Record<string, string>).Range;
  const match = rangeHeader.match(/bytes=(\d+)-(\d+)/)!;
  return {
    startByte: parseInt(match[1], 10),
    endByte: parseInt(match[2], 10),
  };
}

function hangUntilAborted(signal: AbortSignal | null | undefined) {
  return new Promise<never>((_resolve, reject) => {
    signal?.addEventListener('abort', () => reject(signal.reason));
  });
}

function respondWithBytes(bytes: Uint8Array): FakeResponse {
  return {
    ok: true,
    status: 206,
    arrayBuffer: async () => bytes.buffer as ArrayBuffer,
  };
}

function errorResponse(status: number): FakeResponse {
  return {
    ok: false,
    status,
    text: async () => `Streaming service returned error: ${status}`,
  };
}

export class FakeStreamServer {
  requests: RecordedRequest[] = [];

  private readonly serveFromTrack: ResponseOverride = async (
    startByte,
    endByte,
  ) => respondWithBytes(this.track.bytesForRange(startByte, endByte));

  private nextResponse: ResponseOverride = this.serveFromTrack;
  private persistentResponse: ResponseOverride | null = null;

  constructor(private readonly track: Fmp4Track) {}

  setup(): void {
    this.requests = [];
    this.nextResponse = this.serveFromTrack;
    this.persistentResponse = null;
    vi.stubGlobal('fetch', (url: string, options?: RequestInit) =>
      this.handleRequest(url, options),
    );
  }

  teardown(): void {
    vi.unstubAllGlobals();
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
    this.requests = [];
  }

  failNextRequest(status: number): void {
    this.nextResponse = async () => errorResponse(status);
  }

  failAllRequests(status: number): void {
    this.persistentResponse = async () => errorResponse(status);
  }

  succeedNextRequest(): void {
    this.nextResponse = (startByte, endByte, options) =>
      this.serveFromTrack(startByte, endByte, options);
  }

  hangNextRequest(): void {
    this.nextResponse = (_startByte, _endByte, options) =>
      hangUntilAborted(options?.signal);
  }

  corruptNextResponse(): void {
    this.nextResponse = async (startByte, endByte) =>
      respondWithBytes(new Uint8Array(endByte - startByte + 1));
  }

  holdNextRequest(): () => void {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.nextResponse = async (startByte, endByte) => {
      await gate;
      return this.serveFromTrack(startByte, endByte);
    };
    return release;
  }

  private async handleRequest(
    url: string,
    options?: RequestInit,
  ): Promise<FakeResponse> {
    const { startByte, endByte } = parseByteRange(options);
    this.requests.push({ url, startByte, endByte });

    if (this.nextResponse !== this.serveFromTrack) {
      const respond = this.nextResponse;
      this.nextResponse = this.serveFromTrack;
      return respond(startByte, endByte, options);
    }

    if (this.persistentResponse) {
      return this.persistentResponse(startByte, endByte, options);
    }

    return this.serveFromTrack(startByte, endByte, options);
  }
}
