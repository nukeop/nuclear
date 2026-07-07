import { createDebouncedBatcher } from './debouncedBatcher';

const DELAY_MS = 100;

describe('createDebouncedBatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('flushes all items pushed within the delay as a single batch', async () => {
    const flushed: string[][] = [];
    const batcher = createDebouncedBatcher<string>({
      delayMs: DELAY_MS,
      flush: async (items) => {
        flushed.push(items);
      },
    });

    batcher.push(['a']);
    batcher.push(['b', 'c']);
    await vi.advanceTimersByTimeAsync(DELAY_MS);

    expect(flushed).toEqual([['a', 'b', 'c']]);
  });

  it('restarts the delay when new items arrive before the flush', async () => {
    const flushed: string[][] = [];
    const batcher = createDebouncedBatcher<string>({
      delayMs: DELAY_MS,
      flush: async (items) => {
        flushed.push(items);
      },
    });

    batcher.push(['a']);
    await vi.advanceTimersByTimeAsync(DELAY_MS - 1);
    batcher.push(['b']);
    await vi.advanceTimersByTimeAsync(DELAY_MS - 1);
    expect(flushed).toEqual([]);

    await vi.advanceTimersByTimeAsync(1);
    expect(flushed).toEqual([['a', 'b']]);
  });

  it('waits for the previous flush to finish before starting the next one', async () => {
    const startedBatches: string[][] = [];
    let releaseFirstFlush: () => void = () => {};
    const firstFlushGate = new Promise<void>((resolve) => {
      releaseFirstFlush = resolve;
    });
    const batcher = createDebouncedBatcher<string>({
      delayMs: DELAY_MS,
      flush: async (items) => {
        startedBatches.push(items);
        if (startedBatches.length === 1) {
          await firstFlushGate;
        }
      },
    });

    batcher.push(['a']);
    await vi.advanceTimersByTimeAsync(DELAY_MS);
    batcher.push(['b']);
    await vi.advanceTimersByTimeAsync(DELAY_MS);

    expect(startedBatches).toEqual([['a']]);

    releaseFirstFlush();
    await vi.advanceTimersByTimeAsync(0);

    expect(startedBatches).toEqual([['a'], ['b']]);
  });

  it('drops pending items when cancelled', async () => {
    const flushed: string[][] = [];
    const batcher = createDebouncedBatcher<string>({
      delayMs: DELAY_MS,
      flush: async (items) => {
        flushed.push(items);
      },
    });

    batcher.push(['a']);
    batcher.cancel();
    await vi.advanceTimersByTimeAsync(DELAY_MS);

    expect(flushed).toEqual([]);
  });

  it('reports flush errors and keeps flushing subsequent batches', async () => {
    const errors: unknown[] = [];
    const flushed: string[][] = [];
    const batcher = createDebouncedBatcher<string>({
      delayMs: DELAY_MS,
      flush: async (items) => {
        if (items.includes('bad')) {
          throw new Error('boom');
        }
        flushed.push(items);
      },
      onError: (error) => {
        errors.push(error);
      },
    });

    batcher.push(['bad']);
    await vi.advanceTimersByTimeAsync(DELAY_MS);
    batcher.push(['good']);
    await vi.advanceTimersByTimeAsync(DELAY_MS);

    expect(errors).toEqual([new Error('boom')]);
    expect(flushed).toEqual([['good']]);
  });
});
