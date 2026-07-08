import { MockMediaSource } from './mse-test-mocks';
import { MseController } from './MseController';
import { buildBoxWithPadding, buildSidxBox } from './test-helpers';

export {
  MockMediaSource,
  MockSourceBuffer,
  MockTimeRanges,
} from './mse-test-mocks';

export const TIMESCALE = 44100;
export const SEGMENT_REFS = [
  { referencedSize: 50000, subsegmentDuration: TIMESCALE * 60 },
  { referencedSize: 60000, subsegmentDuration: TIMESCALE * 60 },
  { referencedSize: 45000, subsegmentDuration: TIMESCALE * 60 },
];

export const FTYP = buildBoxWithPadding('ftyp', 20);
export const MOOV = buildBoxWithPadding('moov', 100);
export const SIDX = buildSidxBox({
  version: 0,
  timescale: TIMESCALE,
  earliestPresentationTime: 0,
  firstOffset: 0,
  references: SEGMENT_REFS,
});

export const FAKE_HEADER = new Uint8Array([...FTYP, ...MOOV, ...SIDX]);
export const INIT_SEGMENT_END = 120;

export const HEADER_RESPONSE = new Uint8Array(8192);
HEADER_RESPONSE.set(FAKE_HEADER, 0);

export const MSE_URL = 'http://127.0.0.1:3000/stream/test';

export function computeSegmentByteRange(segmentIndex: number): {
  startByte: number;
  endByte: number;
} {
  let startByte = FTYP.length + MOOV.length + SIDX.length;
  for (let index = 0; index < segmentIndex; index++) {
    startByte += SEGMENT_REFS[index].referencedSize;
  }
  const endByte = startByte + SEGMENT_REFS[segmentIndex].referencedSize - 1;
  return { startByte, endByte };
}

export async function flushMicrotasks() {
  for (let round = 0; round < 10; round++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

export class MseTestHarness {
  latestMediaSource: MockMediaSource | null = null;
  fetchMock!: ReturnType<typeof vi.fn>;
  createObjectURLSpy!: ReturnType<
    typeof vi.fn<(obj: MediaSource | Blob) => string>
  >;
  revokeObjectURLSpy!: ReturnType<typeof vi.fn<(url: string) => void>>;
  audio!: HTMLAudioElement;

  private originalMediaSource: unknown;
  private originalManagedMediaSource: unknown;

  install(): void {
    this.originalMediaSource = win.MediaSource;
    this.originalManagedMediaSource = win.ManagedMediaSource;

    const registerLatestMediaSource = (mediaSource: MockMediaSource) => {
      this.latestMediaSource = mediaSource;
    };
    const MockMSConstructor = vi.fn(function () {
      const mediaSource = new MockMediaSource();
      registerLatestMediaSource(mediaSource);
      return mediaSource;
    });
    win.MediaSource = MockMSConstructor;
    delete win.ManagedMediaSource;

    this.fetchMock = this.createFetchMock();
    vi.stubGlobal('fetch', this.fetchMock);

    this.createObjectURLSpy = vi.fn(() => 'blob:mock-url');
    this.revokeObjectURLSpy = vi.fn();
    URL.createObjectURL = this.createObjectURLSpy;
    URL.revokeObjectURL = this.revokeObjectURLSpy;

    this.audio = document.createElement('audio');
    document.body.appendChild(this.audio);
  }

  teardown(): void {
    if (this.originalMediaSource !== undefined) {
      win.MediaSource = this.originalMediaSource;
    } else {
      delete win.MediaSource;
    }

    if (this.originalManagedMediaSource !== undefined) {
      win.ManagedMediaSource = this.originalManagedMediaSource;
    } else {
      delete win.ManagedMediaSource;
    }

    this.latestMediaSource = null;
    vi.restoreAllMocks();

    if (this.audio && this.audio.parentNode) {
      this.audio.parentNode.removeChild(this.audio);
    }
  }

  makeSegmentData(size: number): Uint8Array {
    return new Uint8Array(size).fill(0xab);
  }

  async initController(controller: MseController): Promise<MockMediaSource> {
    const initPromise = controller.init(this.audio, MSE_URL);

    await vi.waitFor(() => expect(this.latestMediaSource).not.toBeNull());
    this.latestMediaSource!.open();

    await initPromise;
    return this.latestMediaSource!;
  }

  private createFetchMock() {
    return vi.fn(async (_url: string, options?: RequestInit) => {
      const rangeHeader = (options?.headers as Record<string, string>)?.Range;
      if (!rangeHeader) {
        return { ok: true, arrayBuffer: async () => HEADER_RESPONSE.buffer };
      }

      const match = rangeHeader.match(/bytes=(\d+)-(\d+)/);
      if (!match) {
        return {
          ok: true,
          arrayBuffer: async () => new ArrayBuffer(0),
        };
      }

      const startByte = parseInt(match[1], 10);
      const endByte = parseInt(match[2], 10);

      if (startByte === 0 && endByte === 8191) {
        return {
          ok: true,
          arrayBuffer: async () => HEADER_RESPONSE.buffer.slice(0),
        };
      }

      const size = endByte - startByte + 1;
      return {
        ok: true,
        arrayBuffer: async () => this.makeSegmentData(size).buffer,
      };
    });
  }
}
