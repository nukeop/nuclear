function waitForUpdateEnd(sourceBuffer: SourceBuffer): Promise<void> {
  return new Promise((resolve) => {
    if (!sourceBuffer.updating) {
      resolve();
      return;
    }

    const onUpdateEnd = () => {
      sourceBuffer.removeEventListener('updateend', onUpdateEnd);
      resolve();
    };
    sourceBuffer.addEventListener('updateend', onUpdateEnd);
  });
}

export class BufferOperationQueue {
  private chain: Promise<void> = Promise.resolve();
  private closed = false;

  constructor(private readonly sourceBuffer: SourceBuffer) {}

  enqueue(operation: () => void): Promise<void> {
    const nextOperation = this.chain.then(async () => {
      if (this.closed) {
        return;
      }

      operation();
      await waitForUpdateEnd(this.sourceBuffer);
    });

    this.chain = nextOperation.catch(() => undefined);

    return nextOperation;
  }

  close(): void {
    this.closed = true;
  }
}
