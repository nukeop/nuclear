import {
  closestCenter,
  pointerWithin,
  type ClientRect,
  type Collision,
  type CollisionDetection,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import partition from 'lodash-es/partition';

export type CanDropInto = (activeId: string, targetId: string) => boolean;

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

export const holdsLayout = (collisions: Collision[] | null) =>
  Boolean(collisions?.some((collision) => collision.data?.holdsLayout));

export const dropIntoCollisionDetection =
  (canDropInto: CanDropInto | undefined): CollisionDetection =>
  (args) => {
    const [dropTargets, sortTargets] = partition(
      args.droppableContainers,
      (container) =>
        canDropInto?.(String(args.active.id), String(container.id)),
    );
    const { collisionRect } = args;
    const draggedCenter = {
      x: collisionRect.left + collisionRect.width / 2,
      y: collisionRect.top + collisionRect.height / 2,
    };
    const drawnRects = new Map<UniqueIdentifier, ClientRect>();
    const drawnMiddles = new Map<UniqueIdentifier, ClientRect>();
    dropTargets.forEach((container) => {
      const node = container.node.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        drawnRects.set(container.id, rect);
        drawnMiddles.set(container.id, middleOf(rect));
      }
    });
    const draggedCenterOn = (rects: Map<UniqueIdentifier, ClientRect>) =>
      pointerWithin({
        ...args,
        pointerCoordinates: draggedCenter,
        droppableContainers: dropTargets,
        droppableRects: rects,
      });

    const [dropTarget] = draggedCenterOn(drawnMiddles);
    if (dropTarget) {
      return [
        { ...dropTarget, data: { ...dropTarget.data, isDropTarget: true } },
      ];
    }
    const [heldTarget] = draggedCenterOn(drawnRects);
    if (heldTarget) {
      return [
        { ...heldTarget, data: { ...heldTarget.data, holdsLayout: true } },
      ];
    }
    return closestCenter({ ...args, droppableContainers: sortTargets });
  };
