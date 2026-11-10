import shuffle from 'lodash-es/shuffle';

import type { QueueItem, RepeatMode } from '@nuclearplayer/model';

export class PlayOrder {
  constructor(
    readonly itemIds: string[],
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

  get currentItemId() {
    return this.itemIds[this.cursor];
  }

  private get lastSlot() {
    return this.itemIds.length - 1;
  }

  private get playNextTailSlot() {
    return this.itemIds.findIndex((itemId) => itemId === this.playNextTailId);
  }

  shuffle() {
    const currentItemId = this.currentItemId;
    if (!currentItemId) {
      return this;
    }
    const otherItemIds = this.itemIds.filter(
      (itemId) => itemId !== currentItemId,
    );
    return new PlayOrder([currentItemId, ...shuffle(otherItemIds)], 0, null);
  }

  shuffleIn(newItemIds: string[]) {
    const allItemIds = [...this.itemIds, ...newItemIds];
    const firstShuffledSlot = Math.max(this.cursor, this.playNextTailSlot) + 1;
    const protectedItemIds = allItemIds.slice(0, firstShuffledSlot);
    const shuffledItemIds = shuffle(allItemIds.slice(firstShuffledSlot));
    return new PlayOrder(
      [...protectedItemIds, ...shuffledItemIds],
      this.cursor,
      this.playNextTailId,
    );
  }

  playNext(newItemIds: string[]) {
    const firstNewSlot = this.cursor + 1;
    const itemIdsAfterInsert = [
      ...this.itemIds.slice(0, firstNewSlot),
      ...newItemIds,
      ...this.itemIds.slice(firstNewSlot),
    ];
    if (this.playNextTailSlot > this.cursor) {
      return new PlayOrder(
        itemIdsAfterInsert,
        this.cursor,
        this.playNextTailId,
      );
    }
    return new PlayOrder(
      itemIdsAfterInsert,
      this.cursor,
      newItemIds.at(-1) ?? null,
    );
  }

  remove(removedItemIds: string[]) {
    const removed = new Set(removedItemIds);
    const remainingItemIds = this.itemIds.filter(
      (itemId) => !removed.has(itemId),
    );

    const removedBeforeCursor = this.itemIds
      .slice(0, this.cursor)
      .filter((itemId) => removed.has(itemId)).length;

    const cursor = Math.min(
      this.cursor - removedBeforeCursor,
      remainingItemIds.length - 1,
    );
    return new PlayOrder(
      remainingItemIds,
      Math.max(0, cursor),
      this.playNextTailId,
    );
  }

  private moveTo(cursor: number) {
    return new PlayOrder(this.itemIds, cursor, this.playNextTailId);
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
