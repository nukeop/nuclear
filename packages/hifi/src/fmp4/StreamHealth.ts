import { FetchBackoff } from './FetchBackoff';
import { isSourceInvalidStatus, RangeFetchFailure } from './SegmentFetcher';

export type FailureHandlers = {
  retrying: (attempt: number, backoffMs: number) => void;
  invalidByStatus: (status: number) => void;
  exhausted: (attempt: number) => void;
};

export class StreamHealth {
  private backoff = new FetchBackoff();
  private invalid = false;

  constructor(private readonly onInvalidated?: () => void) {}

  get isInvalid(): boolean {
    return this.invalid;
  }

  get isWaitingToRetry(): boolean {
    return this.backoff.isWaiting;
  }

  registerSuccess(): void {
    this.backoff.reset();
  }

  registerFailure(failure: RangeFetchFailure, handlers: FailureHandlers): void {
    if (this.invalid) {
      return;
    }

    if (failure.kind === 'httpError' && isSourceInvalidStatus(failure.status)) {
      this.becomeInvalid();
      handlers.invalidByStatus(failure.status);
      return;
    }

    const { attempt, backoffMs } = this.backoff.registerFailure();

    if (this.backoff.isExhausted) {
      this.becomeInvalid();
      handlers.exhausted(attempt);
      return;
    }

    handlers.retrying(attempt, backoffMs);
  }

  invalidate(): boolean {
    if (this.invalid) {
      return false;
    }

    this.becomeInvalid();
    return true;
  }

  private becomeInvalid(): void {
    this.invalid = true;
    this.onInvalidated?.();
  }
}
