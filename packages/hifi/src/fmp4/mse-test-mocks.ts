export type EventHandler = (...args: unknown[]) => void;

export class MockTimeRanges {
  private ranges: [number, number][] = [];
  get length() {
    return this.ranges.length;
  }
  start(index: number) {
    return this.ranges[index][0];
  }
  end(index: number) {
    return this.ranges[index][1];
  }
  addRange(start: number, end: number) {
    this.ranges.push([start, end]);
  }
}

export class MockSourceBuffer {
  updating = false;
  buffered = new MockTimeRanges();
  private listeners: Record<string, EventHandler[]> = {};
  appendBuffer = vi.fn(() => {
    if (this.updating) {
      throw new Error('InvalidStateError: cannot appendBuffer while updating');
    }
    this.updating = true;
    Promise.resolve().then(() => {
      this.updating = false;
      this.fireEvent('updateend');
    });
  });
  remove = vi.fn(() => {
    if (this.updating) {
      throw new Error('InvalidStateError: cannot remove while updating');
    }
    this.updating = true;
    Promise.resolve().then(() => {
      this.updating = false;
      this.fireEvent('updateend');
    });
  });
  abort = vi.fn(() => {
    this.updating = false;
  });
  addEventListener = vi.fn((type: string, handler: EventHandler) => {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(handler);
  });
  removeEventListener = vi.fn((type: string, handler: EventHandler) => {
    const handlers = this.listeners[type];
    if (handlers) {
      this.listeners[type] = handlers.filter(
        (existing) => existing !== handler,
      );
    }
  });
  fireEvent(type: string) {
    const handlers = this.listeners[type];
    if (handlers) {
      for (const handler of [...handlers]) {
        handler();
      }
    }
  }
}

export class MockMediaSource {
  readyState = 'closed' as string;
  duration = 0;
  sourceBuffers: MockSourceBuffer[] = [];
  private listeners: Record<string, EventHandler[]> = {};

  addSourceBuffer = vi.fn((): MockSourceBuffer => {
    const sourceBuffer = new MockSourceBuffer();
    this.sourceBuffers.push(sourceBuffer);
    return sourceBuffer;
  });
  endOfStream = vi.fn(() => {
    this.readyState = 'ended';
  });
  addEventListener = vi.fn((type: string, handler: EventHandler) => {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(handler);
  });
  removeEventListener = vi.fn((type: string, handler: EventHandler) => {
    const handlers = this.listeners[type];
    if (handlers) {
      this.listeners[type] = handlers.filter(
        (existing) => existing !== handler,
      );
    }
  });

  open() {
    this.readyState = 'open';
    this.fireEvent('sourceopen');
  }

  private fireEvent(type: string) {
    const handlers = this.listeners[type];
    if (handlers) {
      for (const handler of [...handlers]) {
        handler();
      }
    }
  }
}
