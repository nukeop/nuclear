import type {
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import compact from 'lodash-es/compact';
import { useState } from 'react';

import type { QueueItem } from '@nuclearplayer/model';

const positionOf = (ids: string[], id: UniqueIdentifier | null): number =>
  ids.findIndex((candidate) => candidate === id);

export const useQueueDrag = (
  items: QueueItem[],
  onMove?: (itemId: string, beforeItemId: string | null) => void,
) => {
  const [draggedId, setDraggedId] = useState<UniqueIdentifier | null>(null);
  const [previewIds, setPreviewIds] = useState<string[]>([]);

  const draggedItem = items.find((item) => item.id === draggedId);

  let displayedItems = items;
  if (draggedItem) {
    const itemsById = new Map(items.map((item) => [item.id, item]));
    displayedItems = compact(previewIds.map((id) => itemsById.get(id)));
  }

  const onDragStart = (event: DragStartEvent) => {
    setDraggedId(event.active.id);
    setPreviewIds(items.map((item) => item.id));
  };

  const onDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id;
    if (!overId || overId === draggedId) {
      return;
    }
    setPreviewIds((ids) =>
      arrayMove(ids, positionOf(ids, draggedId), positionOf(ids, overId)),
    );
  };

  const onDragEnd = () => {
    if (draggedItem) {
      const nextId = previewIds[positionOf(previewIds, draggedId) + 1];
      onMove?.(draggedItem.id, nextId ?? null);
    }
    setDraggedId(null);
  };

  const onDragCancel = () => {
    setDraggedId(null);
  };

  return {
    displayedItems,
    draggedItem,
    dragHandlers: { onDragStart, onDragOver, onDragEnd, onDragCancel },
  };
};
