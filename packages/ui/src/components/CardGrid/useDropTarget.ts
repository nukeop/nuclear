import type { DragMoveEvent } from '@dnd-kit/core';
import {
  hasSortableData,
  rectSortingStrategy,
  type SortingStrategy,
} from '@dnd-kit/sortable';
import { createContext, useState } from 'react';

import { dropTargetOf, holdsLayout } from './dropIntoCollisionDetection';

export const DropTargetContext = createContext<string | undefined>(undefined);

export const useDropTarget = () => {
  const [dropTargetId, setDropTargetId] = useState<string>();
  const [layoutOverIndex, setLayoutOverIndex] = useState<number>();

  const sortingStrategy: SortingStrategy = (args) =>
    rectSortingStrategy({
      ...args,
      overIndex: layoutOverIndex ?? args.overIndex,
    });

  const updateDropTarget = ({ collisions, over }: DragMoveEvent) => {
    const targetId = dropTargetOf(collisions);
    setDropTargetId(targetId);
    if (targetId || holdsLayout(collisions)) {
      return;
    }
    if (hasSortableData(over)) {
      setLayoutOverIndex(over.data.current.sortable.index);
    }
  };

  const endDrag = () => {
    setDropTargetId(undefined);
    setLayoutOverIndex(undefined);
  };

  return { dropTargetId, sortingStrategy, updateDropTarget, endDrag };
};
