export type BackoffStep = {
  attempt: number;
  backoffMs: number;
};

export class FetchBackoff {
  private retries = 0;
  private nextAttemptAtMs = 0;

  constructor(
    private readonly baseDelayMs = 1_000,
    private readonly maxDelayMs = 30_000,
    private readonly maxRetries = 6,
  ) {}

  get isWaiting(): boolean {
    return Date.now() < this.nextAttemptAtMs;
  }

  get isExhausted(): boolean {
    return this.retries >= this.maxRetries;
  }

  registerFailure(): BackoffStep {
    this.retries += 1;
    const backoffMs = Math.min(
      this.baseDelayMs * 2 ** (this.retries - 1),
      this.maxDelayMs,
    );
    this.nextAttemptAtMs = Date.now() + backoffMs;
    return { attempt: this.retries, backoffMs };
  }

  reset(): void {
    this.retries = 0;
    this.nextAttemptAtMs = 0;
  }
}
