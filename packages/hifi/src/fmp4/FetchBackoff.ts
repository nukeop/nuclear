const BACKOFF_BASE_MS = 1_000;
const BACKOFF_MAX_MS = 30_000;

export type FetchFailure = {
  attempt: number;
  backoffMs: number;
};

export class FetchBackoff {
  private consecutiveFailures = 0;
  private nextAttemptAtMs = 0;

  get isWaiting(): boolean {
    return Date.now() < this.nextAttemptAtMs;
  }

  registerFailure(): FetchFailure {
    this.consecutiveFailures += 1;
    const backoffMs = Math.min(
      BACKOFF_BASE_MS * 2 ** (this.consecutiveFailures - 1),
      BACKOFF_MAX_MS,
    );
    this.nextAttemptAtMs = Date.now() + backoffMs;
    return { attempt: this.consecutiveFailures, backoffMs };
  }

  reset(): void {
    this.consecutiveFailures = 0;
    this.nextAttemptAtMs = 0;
  }
}
