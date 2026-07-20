import { FetchBackoff } from './FetchBackoff';
import {
  describeFetchFailure,
  isSourceInvalidStatus,
  RangeFetchFailure,
} from './SegmentFetcher';

export type RetryDecision = {
  fatal: boolean;
  message: string;
};

export class RetryPolicy {
  private backoff = new FetchBackoff();

  get isWaitingToRetry(): boolean {
    return this.backoff.isWaiting;
  }

  onFetchSucceeded(): void {
    this.backoff.reset();
  }

  onFetchFailed(
    segmentIndex: number,
    failure: RangeFetchFailure,
  ): RetryDecision {
    if (failure.kind === 'httpError' && isSourceInvalidStatus(failure.status)) {
      return {
        fatal: true,
        message: `[MSE] Segment ${segmentIndex} fetch rejected with status ${failure.status}; the stream URL is no longer valid`,
      };
    }

    const { attempt, backoffMs } = this.backoff.registerFailure();

    if (this.backoff.isExhausted) {
      return {
        fatal: true,
        message: `[MSE] Segment ${segmentIndex} fetch failed ${attempt} times in a row; giving up on the stream URL`,
      };
    }

    return {
      fatal: false,
      message: `[MSE] Segment ${segmentIndex} fetch failed (attempt ${attempt}, retrying in ${backoffMs}ms): ${describeFetchFailure(failure)}`,
    };
  }
}
