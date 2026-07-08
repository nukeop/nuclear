import { MseController } from './MseController';
import {
  computeSegmentByteRange,
  flushMicrotasks,
  INIT_SEGMENT_END,
  MockMediaSource,
  MockSourceBuffer,
  MockTimeRanges,
  MSE_URL,
  MseTestHarness,
  SEGMENT_REFS,
} from './MseController.test-harness';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

const harness = new MseTestHarness();

describe('MseController', () => {
  beforeEach(() => {
    harness.install();
  });

  afterEach(() => {
    harness.teardown();
  });

  it('creates MediaSource and sets audio.src to object URL', async () => {
    const controller = new MseController();
    await harness.initController(controller);

    expect(harness.createObjectURLSpy).toHaveBeenCalledOnce();
    expect(harness.audio.src).toContain('blob:mock-url');
  });

  it('sets mediaSource.duration from the sidx index', async () => {
    const controller = new MseController();
    await harness.initController(controller);

    expect(harness.latestMediaSource!.duration).toBe(180);
  });

  it('appends init segment to SourceBuffer on sourceopen', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    const sourceBuffer = mediaSource.sourceBuffers[0];
    expect(sourceBuffer.appendBuffer).toHaveBeenCalled();

    const calls = sourceBuffer.appendBuffer.mock.calls as unknown[][];
    const firstAppendArg = calls[0][0] as ArrayBuffer;
    expect(new Uint8Array(firstAppendArg).byteLength).toBe(INIT_SEGMENT_END);
  });

  it('fetches first media segment after init segment is appended', async () => {
    const controller = new MseController();
    await harness.initController(controller);

    expect(harness.fetchMock).toHaveBeenCalledWith(
      MSE_URL,
      expect.objectContaining({
        headers: { Range: 'bytes=0-8191' },
      }),
    );

    const segmentFetchCall = harness.fetchMock.mock.calls.find(
      (call: unknown[]) => {
        const opts = call[1] as { headers?: { Range?: string } } | undefined;
        const range = opts?.headers?.Range;
        return range && range !== 'bytes=0-8191';
      },
    );

    expect(segmentFetchCall).toBeDefined();
  });

  it('does not create MediaSource when getMseBackend returns undefined', async () => {
    delete win.MediaSource;
    delete win.ManagedMediaSource;

    const controller = new MseController();
    await controller.init(harness.audio, MSE_URL);

    await flushMicrotasks();

    expect(harness.latestMediaSource).toBeNull();
    expect(harness.createObjectURLSpy).not.toHaveBeenCalled();
  });

  it('cleans up on destroy', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    controller.destroy(harness.audio);

    expect(harness.revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    expect(mediaSource.endOfStream).toHaveBeenCalled();
  });

  it('destroy handles null audio gracefully', async () => {
    const controller = new MseController();
    await harness.initController(controller);

    controller.destroy(null);

    expect(harness.revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('handles seeking by fetching the correct segment', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    harness.fetchMock.mockClear();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 90,
      writable: true,
      configurable: true,
    });

    await controller.handleSeeking(harness.audio);
    await flushMicrotasks();

    const segmentFetchCalls = harness.fetchMock.mock.calls.filter(
      (call: unknown[]) => {
        const opts = call[1] as { headers?: { Range?: string } } | undefined;
        return opts?.headers?.Range && opts.headers.Range !== 'bytes=0-8191';
      },
    );

    expect(segmentFetchCalls.length).toBeGreaterThan(0);
  });

  it('prefers ManagedMediaSource over MediaSource when available', async () => {
    const managedConstructor = vi.fn(function () {
      harness.latestMediaSource = new MockMediaSource();
      return harness.latestMediaSource;
    });
    win.ManagedMediaSource = managedConstructor;

    const controller = new MseController();
    await harness.initController(controller);

    expect(managedConstructor).toHaveBeenCalledOnce();
    expect(harness.createObjectURLSpy).not.toHaveBeenCalled();
    expect(harness.audio.srcObject).toBe(harness.latestMediaSource);
  });

  it('calls endOfStream after the final media segment is appended', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    expect(mediaSource.endOfStream).not.toHaveBeenCalled();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 170,
      writable: true,
      configurable: true,
    });

    await controller.handleSeeking(harness.audio);
    await flushMicrotasks();

    expect(mediaSource.endOfStream).toHaveBeenCalled();
  });

  it('chain-fetches all remaining segments after a single handleTimeUpdate call', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    harness.fetchMock.mockClear();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60);

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 50,
      writable: true,
      configurable: true,
    });

    controller.handleTimeUpdate(harness.audio);
    await flushMicrotasks();

    const segmentFetchCalls = harness.fetchMock.mock.calls.filter(
      (call: unknown[]) => {
        const opts = call[1] as { headers?: { Range?: string } } | undefined;
        return opts?.headers?.Range && opts.headers.Range !== 'bytes=0-8191';
      },
    );

    expect(segmentFetchCalls.length).toBe(2);
  });

  it('fetches next segment on timeupdate when buffer is low', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    harness.fetchMock.mockClear();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 20);

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 10,
      writable: true,
      configurable: true,
    });

    controller.handleTimeUpdate(harness.audio);
    await flushMicrotasks();

    const segmentFetchCalls = harness.fetchMock.mock.calls.filter(
      (call: unknown[]) => {
        const opts = call[1] as { headers?: { Range?: string } } | undefined;
        return opts?.headers?.Range && opts.headers.Range !== 'bytes=0-8191';
      },
    );

    expect(segmentFetchCalls.length).toBeGreaterThan(0);
  });

  it('fetches the next contiguous segment when the buffered end drifts past its start time', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    harness.fetchMock.mockClear();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60.05);

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 55,
      writable: true,
      configurable: true,
    });

    controller.handleTimeUpdate(harness.audio);
    await flushMicrotasks();

    const { startByte: secondSegmentStart, endByte: secondSegmentEnd } =
      computeSegmentByteRange(1);

    const fetchedRanges = harness.fetchMock.mock.calls.map(
      (call: unknown[]) => {
        const opts = call[1] as { headers?: { Range?: string } } | undefined;
        return opts?.headers?.Range;
      },
    );

    expect(fetchedRanges).toContain(
      `bytes=${secondSegmentStart}-${secondSegmentEnd}`,
    );
  });

  it('retries a segment that failed to append, on a subsequent handleTimeUpdate', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    harness.fetchMock.mockClear();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60);

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 50,
      writable: true,
      configurable: true,
    });

    sourceBuffer.appendBuffer.mockImplementationOnce(() => {
      throw new Error('InvalidStateError: append failed');
    });

    controller.handleTimeUpdate(harness.audio);
    await flushMicrotasks();

    const { startByte, endByte } = computeSegmentByteRange(1);
    const failedSegmentRange = `bytes=${startByte}-${endByte}`;

    const failedSegmentFetches = harness.fetchMock.mock.calls.filter(
      (call: unknown[]) => {
        const opts = call[1] as { headers?: { Range?: string } } | undefined;
        return opts?.headers?.Range === failedSegmentRange;
      },
    );

    expect(failedSegmentFetches.length).toBe(2);
  });

  it('discards a stale pre-seek fetch instead of appending it after the seek clears the buffer', async () => {
    const controller = new MseController();
    const mediaSource = await harness.initController(controller);

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60);

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 50,
      writable: true,
      configurable: true,
    });

    let releaseHeldFetch: () => void = () => {};
    const heldFetchGate = new Promise<void>((resolve) => {
      releaseHeldFetch = resolve;
    });

    harness.fetchMock.mockImplementationOnce(
      async (_url: string, options?: RequestInit) => {
        await heldFetchGate;
        const rangeHeader = (options?.headers as Record<string, string>)?.Range;
        const match = rangeHeader!.match(/bytes=(\d+)-(\d+)/)!;
        const startByte = parseInt(match[1], 10);
        const endByte = parseInt(match[2], 10);
        return {
          ok: true,
          arrayBuffer: async () =>
            harness.makeSegmentData(endByte - startByte + 1).buffer,
        };
      },
    );

    controller.handleTimeUpdate(harness.audio);
    await flushMicrotasks();

    Object.defineProperty(harness.audio, 'currentTime', {
      value: 150,
      writable: true,
      configurable: true,
    });

    sourceBuffer.buffered = new MockTimeRanges();

    await controller.handleSeeking(harness.audio);
    await flushMicrotasks();

    releaseHeldFetch();
    await flushMicrotasks();

    const staleSegmentSize = SEGMENT_REFS[1].referencedSize;
    const staleAppendCalls = sourceBuffer.appendBuffer.mock.calls.filter(
      (call: unknown[]) => {
        const [data] = call as [ArrayBuffer];
        return data.byteLength === staleSegmentSize;
      },
    );

    expect(staleAppendCalls.length).toBe(0);

    const postSeekSegmentSize = SEGMENT_REFS[2].referencedSize;
    const postSeekAppendCalls = sourceBuffer.appendBuffer.mock.calls.filter(
      (call: unknown[]) => {
        const [data] = call as [ArrayBuffer];
        return data.byteLength === postSeekSegmentSize;
      },
    );

    expect(postSeekAppendCalls.length).toBe(1);
  });

  it('reports an error through onError instead of rejecting when the init segment append fails', async () => {
    const controller = new MseController();
    const onError = vi.fn();
    const initPromise = controller.init(
      harness.audio,
      MSE_URL,
      undefined,
      onError,
    );

    await vi.waitFor(() => expect(harness.latestMediaSource).not.toBeNull());

    harness.latestMediaSource!.addSourceBuffer.mockImplementationOnce(() => {
      const sourceBuffer = new MockSourceBuffer();
      sourceBuffer.appendBuffer.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      harness.latestMediaSource!.sourceBuffers.push(sourceBuffer);
      return sourceBuffer;
    });

    harness.latestMediaSource!.open();
    await initPromise;

    expect(onError).toHaveBeenCalledWith(
      new Error('Failed to append init segment'),
    );
  });
});
