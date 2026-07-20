import { errorMessage } from '../utils/errorMessage';

export type RangeFetchResult =
  | { kind: 'ok'; bytes: Uint8Array }
  | { kind: 'httpError'; status: number; body: string }
  | { kind: 'timeout'; timeoutMs: number }
  | { kind: 'aborted' }
  | { kind: 'networkError'; message: string };

export type RangeFetchFailure = Exclude<RangeFetchResult, { kind: 'ok' }>;

export const isSourceInvalidStatus = (status: number): boolean =>
  status === 403 || status === 410;

export const describeFetchFailure = (failure: RangeFetchFailure): string => {
  switch (failure.kind) {
    case 'httpError':
      return failure.body || `HTTP ${failure.status}`;
    case 'timeout':
      return `The streaming server stopped responding (no data after ${failure.timeoutMs / 1000}s)`;
    case 'aborted':
      return 'The request was aborted';
    case 'networkError':
      return failure.message;
  }
};

export class SegmentFetcher {
  constructor(
    private readonly url: string,
    private readonly timeoutMs = 10_000,
  ) {}

  async fetchRange(
    startByte: number,
    endByte: number,
    signal: AbortSignal,
  ): Promise<RangeFetchResult> {
    const timeoutController = new AbortController();
    const abortWithParentReason = () => timeoutController.abort(signal.reason);
    signal.addEventListener('abort', abortWithParentReason, { once: true });

    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      timeoutController.abort();
    }, this.timeoutMs);

    try {
      const response = await fetch(this.url, {
        headers: { Range: `bytes=${startByte}-${endByte}` },
        signal: timeoutController.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        return { kind: 'httpError', status: response.status, body };
      }

      const buffer = await response.arrayBuffer();
      return { kind: 'ok', bytes: new Uint8Array(buffer) };
    } catch (error) {
      if (signal.aborted) {
        return { kind: 'aborted' };
      }
      if (timedOut) {
        return { kind: 'timeout', timeoutMs: this.timeoutMs };
      }
      return { kind: 'networkError', message: errorMessage(error) };
    } finally {
      clearTimeout(timeoutId);
      signal.removeEventListener('abort', abortWithParentReason);
    }
  }
}
