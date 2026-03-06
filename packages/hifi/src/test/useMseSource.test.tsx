import { act, renderHook, waitFor } from '@testing-library/react';

import { useMseSource } from '../hooks/useMseSource';
import { AudioSource } from '../types';

// ---------------------------------------------------------------------------
// Binary helpers (same as parser.test.ts)
// ---------------------------------------------------------------------------

function writeUint32(value: number): number[] {
  return [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ];
}

function writeUint16(value: number): number[] {
  return [(value >>> 8) & 0xff, value & 0xff];
}

function writeAscii(text: string): number[] {
  return [...text].map((char) => char.charCodeAt(0));
}

function buildBoxHeader(type: string, size: number): number[] {
  return [...writeUint32(size), ...writeAscii(type)];
}

function buildBoxWithPadding(type: string, totalSize: number): number[] {
  const header = buildBoxHeader(type, totalSize);
  const padding = new Array(totalSize - header.length).fill(0);
  return [...header, ...padding];
}

function buildSidxBody(options: {
  version: number;
  timescale: number;
  earliestPresentationTime: number;
  firstOffset: number;
  references: { referencedSize: number; subsegmentDuration: number }[];
}): number[] {
  const body: number[] = [];

  body.push(options.version);
  body.push(0, 0, 0);
  body.push(...writeUint32(1));
  body.push(...writeUint32(options.timescale));

  if (options.version === 0) {
    body.push(...writeUint32(options.earliestPresentationTime));
    body.push(...writeUint32(options.firstOffset));
  } else {
    body.push(
      ...writeUint32(0),
      ...writeUint32(options.earliestPresentationTime),
    );
    body.push(...writeUint32(0), ...writeUint32(options.firstOffset));
  }

  body.push(...writeUint16(0));
  body.push(...writeUint16(options.references.length));

  for (const ref of options.references) {
    body.push(...writeUint32(ref.referencedSize & 0x7fffffff));
    body.push(...writeUint32(ref.subsegmentDuration));
    body.push(...writeUint32(0));
  }

  return body;
}

function buildSidxBox(options: Parameters<typeof buildSidxBody>[0]): number[] {
  const body = buildSidxBody(options);
  const totalSize = 8 + body.length;
  return [...buildBoxHeader('sidx', totalSize), ...body];
}

// ---------------------------------------------------------------------------
// Fake fMP4 header: ftyp(20) + moov(100) + sidx(3 segments)
// ---------------------------------------------------------------------------

const TIMESCALE = 44100;
const SEGMENT_REFS = [
  { referencedSize: 50000, subsegmentDuration: TIMESCALE * 60 },
  { referencedSize: 60000, subsegmentDuration: TIMESCALE * 60 },
  { referencedSize: 45000, subsegmentDuration: TIMESCALE * 60 },
];

const FTYP = buildBoxWithPadding('ftyp', 20);
const MOOV = buildBoxWithPadding('moov', 100);
const SIDX = buildSidxBox({
  version: 0,
  timescale: TIMESCALE,
  earliestPresentationTime: 0,
  firstOffset: 0,
  references: SEGMENT_REFS,
});

const FAKE_HEADER = new Uint8Array([...FTYP, ...MOOV, ...SIDX]);
const INIT_SEGMENT_END = 120; // ftyp(20) + moov(100) = offset of sidx

// Pad to 8192 bytes (the hook requests bytes 0-8191)
const HEADER_RESPONSE = new Uint8Array(8192);
HEADER_RESPONSE.set(FAKE_HEADER, 0);

// ---------------------------------------------------------------------------
// Mock classes
// ---------------------------------------------------------------------------

class MockTimeRanges {
  private ranges: [number, number][] = [];
  get length() {
    return this.ranges.length;
  }
  start(index: number) {
    return this.ranges[index][0];
  }
  end(index: number) {
    return this.ranges[index][1];
  }
  addRange(start: number, end: number) {
    this.ranges.push([start, end]);
  }
}

type EventHandler = (...args: unknown[]) => void;

class MockSourceBuffer {
  updating = false;
  buffered = new MockTimeRanges();
  private listeners: Record<string, EventHandler[]> = {};
  appendBuffer = vi.fn(() => {
    this.updating = true;
    Promise.resolve().then(() => {
      this.updating = false;
      this.fireEvent('updateend');
    });
  });
  remove = vi.fn(() => {
    this.updating = true;
    Promise.resolve().then(() => {
      this.updating = false;
      this.fireEvent('updateend');
    });
  });
  abort = vi.fn(() => {
    this.updating = false;
  });
  addEventListener = vi.fn((type: string, handler: EventHandler) => {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(handler);
  });
  removeEventListener = vi.fn((type: string, handler: EventHandler) => {
    const handlers = this.listeners[type];
    if (handlers) {
      this.listeners[type] = handlers.filter(
        (existing) => existing !== handler,
      );
    }
  });
  fireEvent(type: string) {
    const handlers = this.listeners[type];
    if (handlers) {
      for (const handler of [...handlers]) {
        handler();
      }
    }
  }
}

class MockMediaSource {
  readyState = 'closed' as string;
  duration = 0;
  sourceBuffers: MockSourceBuffer[] = [];
  private listeners: Record<string, EventHandler[]> = {};

  addSourceBuffer = vi.fn((): MockSourceBuffer => {
    const sourceBuffer = new MockSourceBuffer();
    this.sourceBuffers.push(sourceBuffer);
    return sourceBuffer;
  });
  endOfStream = vi.fn(() => {
    this.readyState = 'ended';
  });
  addEventListener = vi.fn((type: string, handler: EventHandler) => {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(handler);
  });
  removeEventListener = vi.fn((type: string, handler: EventHandler) => {
    const handlers = this.listeners[type];
    if (handlers) {
      this.listeners[type] = handlers.filter(
        (existing) => existing !== handler,
      );
    }
  });

  open() {
    this.readyState = 'open';
    this.fireEvent('sourceopen');
  }

  private fireEvent(type: string) {
    const handlers = this.listeners[type];
    if (handlers) {
      for (const handler of [...handlers]) {
        handler();
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Setup and teardown
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

let latestMediaSource: MockMediaSource | null = null;
let fetchMock: ReturnType<typeof vi.fn>;
let createObjectURLSpy: ReturnType<typeof vi.fn>;
let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
let originalMediaSource: unknown;
let originalManagedMediaSource: unknown;
let audio: HTMLAudioElement;

function makeSegmentData(size: number): Uint8Array {
  return new Uint8Array(size).fill(0xab);
}

function createFetchMock() {
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
      arrayBuffer: async () => makeSegmentData(size).buffer,
    };
  });
}

function installMocks() {
  originalMediaSource = win.MediaSource;
  originalManagedMediaSource = win.ManagedMediaSource;

  const MockMSConstructor = vi.fn(() => {
    latestMediaSource = new MockMediaSource();
    return latestMediaSource;
  });
  win.MediaSource = MockMSConstructor;
  delete win.ManagedMediaSource;

  fetchMock = createFetchMock();
  vi.stubGlobal('fetch', fetchMock);

  createObjectURLSpy = vi.fn(() => 'blob:mock-url');
  revokeObjectURLSpy = vi.fn();
  URL.createObjectURL = createObjectURLSpy;
  URL.revokeObjectURL = revokeObjectURLSpy;

  audio = document.createElement('audio');
  document.body.appendChild(audio);
}

function removeMocks() {
  if (originalMediaSource !== undefined) {
    win.MediaSource = originalMediaSource;
  } else {
    delete win.MediaSource;
  }

  if (originalManagedMediaSource !== undefined) {
    win.ManagedMediaSource = originalManagedMediaSource;
  } else {
    delete win.ManagedMediaSource;
  }

  latestMediaSource = null;
  vi.restoreAllMocks();

  if (audio && audio.parentNode) {
    audio.parentNode.removeChild(audio);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MSE_SOURCE = {
  url: 'http://127.0.0.1:3000/stream/test',
  protocol: 'mse',
  durationSeconds: 180,
} as unknown as AudioSource;

const HTTP_SOURCE: AudioSource = { url: '/a.mp3', protocol: 'http' };

async function waitForInitialization() {
  await waitFor(() => {
    expect(latestMediaSource).not.toBeNull();
  });

  const mediaSource = latestMediaSource!;
  await act(async () => {
    mediaSource.open();
  });

  // Let the init segment append + first segment fetch settle
  await act(async () => {
    await flushMicrotasks();
  });
}

async function flushMicrotasks() {
  // Multiple rounds to let chained promises resolve
  for (let round = 0; round < 10; round++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useMseSource', () => {
  beforeEach(() => {
    installMocks();
  });

  afterEach(() => {
    removeMocks();
  });

  it('creates MediaSource and sets audio.src to object URL when protocol is mse', async () => {
    const audioRef = { current: audio };

    renderHook(() => useMseSource(audioRef, MSE_SOURCE, true));

    await waitForInitialization();

    expect(createObjectURLSpy).toHaveBeenCalledOnce();
    expect(audio.src).toContain('blob:mock-url');
  });

  it('sets mediaSource.duration to the value from src.durationSeconds', async () => {
    const audioRef = { current: audio };

    renderHook(() => useMseSource(audioRef, MSE_SOURCE, true));

    await waitForInitialization();

    expect(latestMediaSource!.duration).toBe(180);
  });

  it('appends init segment to SourceBuffer on sourceopen', async () => {
    const audioRef = { current: audio };

    renderHook(() => useMseSource(audioRef, MSE_SOURCE, true));

    await waitForInitialization();

    const sourceBuffer = latestMediaSource!.sourceBuffers[0];
    expect(sourceBuffer.appendBuffer).toHaveBeenCalled();

    const calls = sourceBuffer.appendBuffer.mock.calls as unknown[][];
    const firstAppendArg = calls[0][0] as ArrayBuffer;
    expect(new Uint8Array(firstAppendArg).byteLength).toBe(INIT_SEGMENT_END);
  });

  it('fetches first media segment after init segment is appended', async () => {
    const audioRef = { current: audio };

    renderHook(() => useMseSource(audioRef, MSE_SOURCE, true));

    await waitForInitialization();

    expect(fetchMock).toHaveBeenCalledWith(
      MSE_SOURCE.url,
      expect.objectContaining({
        headers: { Range: 'bytes=0-8191' },
      }),
    );

    const segmentFetchCall = fetchMock.mock.calls.find((call: unknown[]) => {
      const opts = call[1] as { headers?: { Range?: string } } | undefined;
      const range = opts?.headers?.Range;
      return range && range !== 'bytes=0-8191';
    });

    expect(segmentFetchCall).toBeDefined();
  });

  it('does not activate for non-MSE protocols', async () => {
    const audioRef = { current: audio };

    renderHook(() => useMseSource(audioRef, HTTP_SOURCE, true));

    await act(async () => {
      await flushMicrotasks();
    });

    expect(latestMediaSource).toBeNull();
    expect(createObjectURLSpy).not.toHaveBeenCalled();
  });

  it('does not activate when isReady is false', async () => {
    const audioRef = { current: audio };

    renderHook(() => useMseSource(audioRef, MSE_SOURCE, false));

    await act(async () => {
      await flushMicrotasks();
    });

    expect(latestMediaSource).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('cleans up MediaSource when source changes away from MSE', async () => {
    const audioRef = { current: audio };

    const { rerender } = renderHook(
      ({ src }: { src: AudioSource }) => useMseSource(audioRef, src, true),
      { initialProps: { src: MSE_SOURCE } },
    );

    await waitForInitialization();

    const mediaSource = latestMediaSource!;

    rerender({ src: HTTP_SOURCE });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    expect(mediaSource.endOfStream).toHaveBeenCalled();
  });

  it('cleans up on unmount', async () => {
    const audioRef = { current: audio };

    const { unmount } = renderHook(() =>
      useMseSource(audioRef, MSE_SOURCE, true),
    );

    await waitForInitialization();

    unmount();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('handles seeking by fetching the correct segment', async () => {
    const audioRef = { current: audio };

    renderHook(() => useMseSource(audioRef, MSE_SOURCE, true));

    await waitForInitialization();

    fetchMock.mockClear();

    const sourceBuffer = latestMediaSource!.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();

    audio.currentTime = 90;
    await act(async () => {
      audio.dispatchEvent(new Event('seeking'));
      await flushMicrotasks();
    });

    const segmentFetchCalls = fetchMock.mock.calls.filter((call: unknown[]) => {
      const opts = call[1] as { headers?: { Range?: string } } | undefined;
      return opts?.headers?.Range && opts.headers.Range !== 'bytes=0-8191';
    });

    expect(segmentFetchCalls.length).toBeGreaterThan(0);
  });

  it('prefers ManagedMediaSource over MediaSource when available', async () => {
    const audioRef = { current: audio };

    const managedConstructor = vi.fn(() => {
      latestMediaSource = new MockMediaSource();
      return latestMediaSource;
    });
    win.ManagedMediaSource = managedConstructor;

    renderHook(() => useMseSource(audioRef, MSE_SOURCE, true));

    await waitForInitialization();

    expect(managedConstructor).toHaveBeenCalledOnce();
    expect(createObjectURLSpy).not.toHaveBeenCalled();
    expect(audio.srcObject).toBe(latestMediaSource);
  });
});
