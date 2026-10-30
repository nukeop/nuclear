import {
  closestCenter,
  pointerWithin,
  type ClientRect,
  type Collision,
  type CollisionDetection,
  type DragMoveEvent,
} from '@dnd-kit/core';
import { rectSortingStrategy, type SortingStrategy } from '@dnd-kit/sortable';
import { createContext, useState } from 'react';

export type CanDropInto = (activeId: string, targetId: string) => boolean;

export const DropTargetContext = createContext<string | undefined>(undefined);

const middleOf = (rect: ClientRect): ClientRect => {
  const insetX = rect.width / 4;
  const insetY = rect.height / 4;
  return {
    left: rect.left + insetX,
    right: rect.right - insetX,
    top: rect.top + insetY,
    bottom: rect.bottom - insetY,
    width: rect.width - insetX * 2,
    height: rect.height - insetY * 2,
  };
};

export const dropTargetOf = (collisions: Collision[] | null) => {
  const dropTarget = collisions?.find(
    (collision) => collision.data?.isDropTarget,
  );
  return dropTarget && String(dropTarget.id);
};

export const useDropTarget = (canDropInto: CanDropInto | undefined) => {
  const [dropTargetId, setDropTargetId] = useState<string>();

  const collisionDetection: CollisionDetection = (args) => {
    const dropTargets = args.droppableContainers.filter((container) =>
      canDropInto?.(String(args.active.id), String(container.id)),
    );
    const [dropTarget] = pointerWithin({
      ...args,
      droppableContainers: dropTargets,
      droppableRects: new Map(
        [...args.droppableRects].map(([id, rect]) => [id, middleOf(rect)]),
      ),
    });
    if (dropTarget) {
      return [
        { ...dropTarget, data: { ...dropTarget.data, isDropTarget: true } },
      ];
    }
    return closestCenter(args);
  };

  const sortingStrategy: SortingStrategy = (args) => {
    if (dropTargetId) {
      return null;
    }
    return rectSortingStrategy(args);
  };

  return {
    dropTargetId,
    collisionDetection,
    sortingStrategy,
    updateDropTarget: ({ collisions }: DragMoveEvent) =>
      setDropTargetId(dropTargetOf(collisions)),
    clearDropTarget: () => setDropTargetId(undefined),
  };
};
