import shuffle from 'lodash-es/shuffle';

import type { QueueItem, RepeatMode } from '@nuclearplayer/model';

export class PlayOrder {
  constructor(
    readonly ids: string[],
    readonly cursor: number,
    readonly playNextTailId: string | null,
  ) {}

  static fromQueue(items: QueueItem[], currentIndex: number) {
    return new PlayOrder(
      items.map((item) => item.id),
      currentIndex,
      null,
    );
  }

  get currentId() {
    return this.ids[this.cursor];
  }

  private get lastSlot() {
    return this.ids.length - 1;
  }

  private get playNextTailSlot() {
    return this.ids.findIndex((id) => id === this.playNextTailId);
  }

  shuffle() {
    const currentId = this.currentId;
    if (!currentId) {
      return this;
    }
    const otherIds = this.ids.filter((id) => id !== currentId);
    return new PlayOrder([currentId, ...shuffle(otherIds)], 0, null);
  }

  shuffleIn(newIds: string[]) {
    const ids = [...this.ids, ...newIds];
    const firstShuffledSlot = Math.max(this.cursor, this.playNextTailSlot) + 1;
    return new PlayOrder(
      [
        ...ids.slice(0, firstShuffledSlot),
        ...shuffle(ids.slice(firstShuffledSlot)),
      ],
      this.cursor,
      this.playNextTailId,
    );
  }

  playNext(newIds: string[]) {
    const firstNewSlot = this.cursor + 1;
    const ids = [
      ...this.ids.slice(0, firstNewSlot),
      ...newIds,
      ...this.ids.slice(firstNewSlot),
    ];
    if (this.playNextTailSlot > this.cursor) {
      return new PlayOrder(ids, this.cursor, this.playNextTailId);
    }
    return new PlayOrder(ids, this.cursor, newIds.at(-1) ?? null);
  }

  private moveTo(cursor: number) {
    return new PlayOrder(this.ids, cursor, this.playNextTailId);
  }

  next(repeatMode: RepeatMode) {
    if (this.cursor < this.lastSlot) {
      return this.moveTo(this.cursor + 1);
    }
    if (repeatMode === 'all') {
      return this.moveTo(0);
    }
    return this;
  }

  previous(repeatMode: RepeatMode) {
    if (this.cursor > 0) {
      return this.moveTo(this.cursor - 1);
    }
    if (repeatMode === 'all') {
      return this.moveTo(this.lastSlot);
    }
    return this;
  }
}
