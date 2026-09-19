export class RingBuffer<T> {
  private buffer: T[] = [];
  private head = 0;
  private count = 0;
  private bufferVersion = 0;

  constructor(private readonly capacity: number) {}

  get version(): number {
    return this.bufferVersion;
  }

  push(item: T): void {
    this.bufferVersion++;
    if (this.count < this.capacity) {
      this.buffer.push(item);
      this.count++;
    } else {
      this.buffer[this.head] = item;
      this.head = (this.head + 1) % this.capacity;
    }
  }

  clear(): void {
    this.bufferVersion++;
    this.buffer = [];
    this.head = 0;
    this.count = 0;
  }

  toArray(): T[] {
    if (this.count < this.capacity) {
      return [...this.buffer];
    }
    return [
      ...this.buffer.slice(this.head),
      ...this.buffer.slice(0, this.head),
    ];
  }

  prepend(items: T[]): void {
    this.bufferVersion++;
    const current = this.toArray();
    const combined = [...items, ...current];
    const toKeep = combined.slice(-this.capacity);
    this.buffer = [...toKeep];
    this.count = toKeep.length;
    this.head = 0;
  }
}
