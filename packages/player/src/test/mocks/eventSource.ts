type EventSourceListener = (event: Event & { data?: string }) => void;

export class MockEventSource {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  static lastInstance: MockEventSource | null = null;

  readyState = MockEventSource.CONNECTING;
  url: string;
  private listeners = new Map<string, EventSourceListener[]>();

  constructor(url: string) {
    this.url = url;
    MockEventSource.lastInstance = this;
  }

  addEventListener(type: string, listener: EventSourceListener) {
    const existing = this.listeners.get(type) ?? [];
    existing.push(listener);
    this.listeners.set(type, existing);
  }

  removeEventListener(type: string, listener: EventSourceListener) {
    const existing = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      existing.filter((item) => item !== listener),
    );
  }

  close() {
    this.readyState = MockEventSource.CLOSED;
  }

  simulateOpen() {
    this.readyState = MockEventSource.OPEN;
    this.emit('open', new Event('open'));
  }

  simulateError() {
    this.readyState = MockEventSource.CLOSED;
    this.emit('error', new Event('error'));
  }

  simulateEvent(type: string, data: unknown) {
    this.emit(
      type,
      Object.assign(new Event(type), { data: JSON.stringify(data) }),
    );
  }

  private emit(type: string, event: Event) {
    (this.listeners.get(type) ?? []).forEach((listener) => listener(event));
  }
}
