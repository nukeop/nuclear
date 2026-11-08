import shuffle from 'lodash-es/shuffle';

import type { QueueItem, RepeatMode } from '@nuclearplayer/model';

export class PlayOrder {
  constructor(
    readonly ids: string[],
    readonly cursor: number,
  ) {}

  static fromQueue(items: QueueItem[], currentIndex: number) {
    return new PlayOrder(
      items.map((item) => item.id),
      currentIndex,
    );
  }

  get currentId() {
    return this.ids[this.cursor];
  }

  private get lastSlot() {
    return this.ids.length - 1;
  }

  shuffle() {
    const currentId = this.currentId;
    if (!currentId) {
      return this;
    }
    const otherIds = this.ids.filter((id) => id !== currentId);
    return new PlayOrder([currentId, ...shuffle(otherIds)], 0);
  }

  next(repeatMode: RepeatMode) {
    if (this.cursor < this.lastSlot) {
      return new PlayOrder(this.ids, this.cursor + 1);
    }
    if (repeatMode === 'all') {
      return new PlayOrder(this.ids, 0);
    }
    return this;
  }

  previous(repeatMode: RepeatMode) {
    if (this.cursor > 0) {
      return new PlayOrder(this.ids, this.cursor - 1);
    }
    if (repeatMode === 'all') {
      return new PlayOrder(this.ids, this.lastSlot);
    }
    return this;
  }
}
