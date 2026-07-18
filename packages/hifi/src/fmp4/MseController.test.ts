import { FakeStreamServer } from '../test/fakes/FakeStreamServer';
import { DEFAULT_TRACK, MSE_URL } from '../test/fixtures/fmp4Stream';
import { initMockLogger } from '../test/mocks/mockLogger';
import { flushMicrotasks } from '../test/test-utils';
import { MseController } from './MseController';
import {
  MockMediaSource,
  MockSourceBuffer,
  MockTimeRanges,
  MseTestFixture,
} from './MseController.test-fixture';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

const fixture = new MseTestFixture();
const server = new FakeStreamServer(DEFAULT_TRACK);

describe('MseController', () => {
  beforeEach(() => {
    initMockLogger();
    fixture.setup();
    server.setup();
  });

  afterEach(() => {
    fixture.teardown();
    server.teardown();
  });

  it('creates MediaSource and sets audio.src to object URL', async () => {
    const controller = new MseController();
    await fixture.initController(controller);

    expect(fixture.createObjectURLSpy).toHaveBeenCalledOnce();
    expect(fixture.audio.src).toContain('blob:mock-url');
  });

  it('sets mediaSource.duration from the sidx index', async () => {
    const controller = new MseController();
    await fixture.initController(controller);

    expect(fixture.latestMediaSource!.duration).toBe(180);
  });

  it('appends init segment to SourceBuffer on sourceopen', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    const sourceBuffer = mediaSource.sourceBuffers[0];
    expect(sourceBuffer.appendBuffer).toHaveBeenCalled();

    const calls = sourceBuffer.appendBuffer.mock.calls as unknown[][];
    const firstAppendArg = calls[0][0] as ArrayBuffer;
    expect(new Uint8Array(firstAppendArg).byteLength).toBe(
      DEFAULT_TRACK.initSegmentEnd,
    );
  });

  it('fetches first media segment after init segment is appended', async () => {
    const controller = new MseController();
    await fixture.initController(controller);

    expect(server.headerRequests).toEqual([
      { url: MSE_URL, startByte: 0, endByte: 8191 },
    ]);
    expect(server.segmentRequests.length).toBeGreaterThan(0);
  });

  it('does not create MediaSource when getMseBackend returns undefined', async () => {
    delete win.MediaSource;
    delete win.ManagedMediaSource;

    const controller = new MseController();
    await controller.init(fixture.audio, MSE_URL);

    await flushMicrotasks();

    expect(fixture.latestMediaSource).toBeNull();
    expect(fixture.createObjectURLSpy).not.toHaveBeenCalled();
  });

  it('reports an error through onError when no MSE backend is available', async () => {
    delete win.MediaSource;
    delete win.ManagedMediaSource;

    const controller = new MseController();
    const onError = vi.fn();
    await controller.init(fixture.audio, MSE_URL, undefined, onError);

    await flushMicrotasks();

    expect(onError).toHaveBeenCalledWith(
      new Error(
        'Streaming is not available because this system lacks MediaSource Extensions. Updating your system web engine may fix this.',
      ),
    );
  });

  it('reports an error through onError when the stream header cannot be downloaded', async () => {
    server.failNextRequest();

    const controller = new MseController();
    const onError = vi.fn();
    await controller.init(fixture.audio, MSE_URL, undefined, onError);

    expect(onError).toHaveBeenCalledWith(
      new Error(
        'Could not load the audio stream: Streaming service returned error: 403 Forbidden',
      ),
    );
  });

  it('reports an error through onError when the stream header cannot be parsed', async () => {
    server.corruptNextResponse();

    const controller = new MseController();
    const onError = vi.fn();
    await controller.init(fixture.audio, MSE_URL, undefined, onError);

    expect(onError).toHaveBeenCalledWith(
      new Error(
        'The audio stream is not in a supported format. Try a different source for this track.',
      ),
    );
  });

  it('cleans up on destroy', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    controller.destroy(fixture.audio);

    expect(fixture.revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    expect(mediaSource.endOfStream).toHaveBeenCalled();
  });

  it('destroy handles null audio gracefully', async () => {
    const controller = new MseController();
    await fixture.initController(controller);

    controller.destroy(null);

    expect(fixture.revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('handles seeking by fetching the correct segment', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    server.clearRequestLog();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 90,
      writable: true,
      configurable: true,
    });

    await controller.handleSeeking(fixture.audio);
    await flushMicrotasks();

    expect(server.segmentRequests.length).toBeGreaterThan(0);
  });

  it('prefers ManagedMediaSource over MediaSource when available', async () => {
    const managedConstructor = vi.fn(function () {
      fixture.latestMediaSource = new MockMediaSource();
      return fixture.latestMediaSource;
    });
    win.ManagedMediaSource = managedConstructor;

    const controller = new MseController();
    await fixture.initController(controller);

    expect(managedConstructor).toHaveBeenCalledOnce();
    expect(fixture.createObjectURLSpy).not.toHaveBeenCalled();
    expect(fixture.audio.srcObject).toBe(fixture.latestMediaSource);
  });

  it('calls endOfStream after the final media segment is appended', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    expect(mediaSource.endOfStream).not.toHaveBeenCalled();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 170,
      writable: true,
      configurable: true,
    });

    await controller.handleSeeking(fixture.audio);
    await flushMicrotasks();

    expect(mediaSource.endOfStream).toHaveBeenCalled();
  });

  it('chain-fetches all remaining segments after a single handleTimeUpdate call', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    server.clearRequestLog();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60);

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 50,
      writable: true,
      configurable: true,
    });

    controller.handleTimeUpdate(fixture.audio);
    await flushMicrotasks();

    expect(server.segmentRequests.length).toBe(2);
  });

  it('fetches next segment on timeupdate when buffer is low', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    server.clearRequestLog();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 20);

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 10,
      writable: true,
      configurable: true,
    });

    controller.handleTimeUpdate(fixture.audio);
    await flushMicrotasks();

    expect(server.segmentRequests.length).toBeGreaterThan(0);
  });

  it('fetches the next contiguous segment when the buffered end drifts past its start time', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    server.clearRequestLog();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60.05);

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 55,
      writable: true,
      configurable: true,
    });

    controller.handleTimeUpdate(fixture.audio);
    await flushMicrotasks();

    expect(server.requestCountForSegment(1)).toBe(1);
  });

  it('retries a segment that failed to append, on a subsequent handleTimeUpdate', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    server.clearRequestLog();

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60);

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 50,
      writable: true,
      configurable: true,
    });

    sourceBuffer.appendBuffer.mockImplementationOnce(() => {
      throw new Error('InvalidStateError: append failed');
    });

    controller.handleTimeUpdate(fixture.audio);
    await flushMicrotasks();

    expect(server.requestCountForSegment(1)).toBe(2);
  });

  it('discards a stale pre-seek fetch instead of appending it after the seek clears the buffer', async () => {
    const controller = new MseController();
    const mediaSource = await fixture.initController(controller);

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60);

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 50,
      writable: true,
      configurable: true,
    });

    const releaseHeldFetch = server.holdNextRequest();

    controller.handleTimeUpdate(fixture.audio);
    await flushMicrotasks();

    Object.defineProperty(fixture.audio, 'currentTime', {
      value: 150,
      writable: true,
      configurable: true,
    });

    sourceBuffer.buffered = new MockTimeRanges();

    await controller.handleSeeking(fixture.audio);
    await flushMicrotasks();

    releaseHeldFetch();
    await flushMicrotasks();

    const staleSegmentSize = DEFAULT_TRACK.segmentSize(1);
    const staleAppendCalls = sourceBuffer.appendBuffer.mock.calls.filter(
      (call: unknown[]) => {
        const [data] = call as [ArrayBuffer];
        return data.byteLength === staleSegmentSize;
      },
    );

    expect(staleAppendCalls.length).toBe(0);

    const postSeekSegmentSize = DEFAULT_TRACK.segmentSize(2);
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
      fixture.audio,
      MSE_URL,
      undefined,
      onError,
    );

    await vi.waitFor(() => expect(fixture.latestMediaSource).not.toBeNull());

    fixture.latestMediaSource!.addSourceBuffer.mockImplementationOnce(() => {
      const sourceBuffer = new MockSourceBuffer();
      sourceBuffer.appendBuffer.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      fixture.latestMediaSource!.sourceBuffers.push(sourceBuffer);
      return sourceBuffer;
    });

    fixture.latestMediaSource!.open();
    await initPromise;

    expect(onError).toHaveBeenCalledWith(
      new Error(
        'The audio engine rejected the stream data. The codec may be unsupported. Try a different source for this track.',
      ),
    );
  });

  describe('segment fetch resilience', () => {
    const SEGMENT_FETCH_TIMEOUT_MS = 10000;
    const FIRST_RETRY_BACKOFF_MS = 1000;
    const SECOND_RETRY_BACKOFF_MS = 2000;

    afterEach(() => {
      vi.useRealTimers();
    });

    it('aborts a segment fetch that hangs past the timeout so a later poll can retry it', async () => {
      const controller = new MseController();
      await fixture.initControllerAtLowBuffer(controller);
      vi.useFakeTimers();

      server.hangNextRequest();
      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(SEGMENT_FETCH_TIMEOUT_MS);
      await vi.advanceTimersByTimeAsync(FIRST_RETRY_BACKOFF_MS);

      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);

      expect(server.requestCountForSegment(1)).toBe(2);
    });

    it('waits for the backoff delay before refetching a segment after a failed fetch', async () => {
      const controller = new MseController();
      await fixture.initControllerAtLowBuffer(controller);
      vi.useFakeTimers();

      server.failNextRequest();
      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);

      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);
      expect(server.requestCountForSegment(1)).toBe(1);

      await vi.advanceTimersByTimeAsync(FIRST_RETRY_BACKOFF_MS);
      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);
      expect(server.requestCountForSegment(1)).toBe(2);
    });

    it('doubles the backoff delay after consecutive fetch failures', async () => {
      const controller = new MseController();
      await fixture.initControllerAtLowBuffer(controller);
      vi.useFakeTimers();

      server.failNextRequest();
      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);

      await vi.advanceTimersByTimeAsync(FIRST_RETRY_BACKOFF_MS);
      server.failNextRequest();
      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);
      expect(server.requestCountForSegment(1)).toBe(2);

      await vi.advanceTimersByTimeAsync(FIRST_RETRY_BACKOFF_MS);
      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);
      expect(server.requestCountForSegment(1)).toBe(2);

      await vi.advanceTimersByTimeAsync(
        SECOND_RETRY_BACKOFF_MS - FIRST_RETRY_BACKOFF_MS,
      );
      controller.handleTimeUpdate(fixture.audio);
      await vi.advanceTimersByTimeAsync(0);
      expect(server.requestCountForSegment(1)).toBe(3);
    });
  });
});
