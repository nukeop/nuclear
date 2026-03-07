import type { QueueItem, Track } from '@nuclearplayer/model';

import type { Queue, QueueHost, QueueItemStateUpdate } from '../types/queue';

export class QueueAPI {
  #host?: QueueHost;

  constructor(host?: QueueHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: QueueHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Queue host not available');
    }
    return fn(host);
  }

  getQueue() {
    return this.#withHost((h) => h.getQueue());
  }

  getCurrentItem() {
    return this.#withHost((h) => h.getCurrentItem());
  }

  addToQueue(tracks: Track[]) {
    return this.#withHost((h) => h.addToQueue(tracks));
  }

  addNext(tracks: Track[]) {
    return this.#withHost((h) => h.addNext(tracks));
  }

  addAt(tracks: Track[], index: number) {
    return this.#withHost((h) => h.addAt(tracks, index));
  }

  removeByIds(ids: string[]) {
    return this.#withHost((h) => h.removeByIds(ids));
  }

  removeByIndices(indices: number[]) {
    return this.#withHost((h) => h.removeByIndices(indices));
  }

  clearQueue() {
    return this.#withHost((h) => h.clearQueue());
  }

  reorder(fromIndex: number, toIndex: number) {
    return this.#withHost((h) => h.reorder(fromIndex, toIndex));
  }

  updateItemState(id: string, updates: QueueItemStateUpdate) {
    return this.#withHost((h) => h.updateItemState(id, updates));
  }

  goToNext() {
    return this.#withHost((h) => h.goToNext());
  }

  goToPrevious() {
    return this.#withHost((h) => h.goToPrevious());
  }

  goToIndex(index: number) {
    return this.#withHost((h) => h.goToIndex(index));
  }

  goToId(id: string) {
    return this.#withHost((h) => h.goToId(id));
  }

  subscribe(listener: (queue: Queue) => void) {
    return this.#withHost((h) => h.subscribe(listener));
  }

  subscribeToCurrentItem(listener: (item: QueueItem | undefined) => void) {
    return this.#withHost((h) => h.subscribeToCurrentItem(listener));
  }
}
