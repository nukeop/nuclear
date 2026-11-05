import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import clamp from 'lodash-es/clamp';
import { FC, ReactNode, RefObject, useCallback } from 'react';
import { createPortal } from 'react-dom';

const DRAG_ACTIVATION_DISTANCE_PX = 5;
const EDGE_INSET_PX = 1;

type QueueReorderLayerProps = {
  enabled: boolean;
  viewportRef: RefObject<HTMLDivElement | null>;
  overlay?: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragCancel?: () => void;
  children: ReactNode;
};

const clampToViewport = (
  point: { x: number; y: number },
  viewport: DOMRect,
): { x: number; y: number } => ({
  x: clamp(
    point.x,
    viewport.left + EDGE_INSET_PX,
    viewport.right - EDGE_INSET_PX,
  ),
  y: clamp(
    point.y,
    viewport.top + EDGE_INSET_PX,
    viewport.bottom - EDGE_INSET_PX,
  ),
});

const findRowIdAt = (point: { x: number; y: number }): string | null => {
  const row = document
    .elementsFromPoint(point.x, point.y)
    .find(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element.dataset.queueRowId !== undefined,
    );
  return row?.dataset.queueRowId ?? null;
};

export const QueueReorderLayer: FC<QueueReorderLayerProps> = ({
  enabled,
  viewportRef,
  overlay,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
  children,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE_PX },
    }),
  );

  const rowNearestPointer = useCallback<CollisionDetection>(
    ({ pointerCoordinates }) => {
      const viewport = viewportRef.current;
      if (!pointerCoordinates || !viewport) {
        return [];
      }
      const rowId = findRowIdAt(
        clampToViewport(pointerCoordinates, viewport.getBoundingClientRect()),
      );
      if (!rowId) {
        return [];
      }
      return [{ id: rowId }];
    },
    [viewportRef],
  );

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rowNearestPointer}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}
      {createPortal(
        <DragOverlay dropAnimation={null}>{overlay}</DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};
