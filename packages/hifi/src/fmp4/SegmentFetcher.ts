const SEGMENT_FETCH_TIMEOUT_MS = 10_000;

export class SegmentFetcher {
  constructor(private readonly url: string) {}

  async fetchRange(
    startByte: number,
    endByte: number,
    signal: AbortSignal,
  ): Promise<Uint8Array> {
    const timeoutController = new AbortController();
    const abortWithParentReason = () => timeoutController.abort(signal.reason);
    signal.addEventListener('abort', abortWithParentReason, { once: true });
    const timeoutId = setTimeout(
      () =>
        timeoutController.abort(
          new Error(
            `The streaming server stopped responding (no data after ${SEGMENT_FETCH_TIMEOUT_MS / 1000}s)`,
          ),
        ),
      SEGMENT_FETCH_TIMEOUT_MS,
    );

    try {
      const response = await fetch(this.url, {
        headers: { Range: `bytes=${startByte}-${endByte}` },
        signal: timeoutController.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Fetch failed with status ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } finally {
      clearTimeout(timeoutId);
      signal.removeEventListener('abort', abortWithParentReason);
    }
  }
}
