import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FC, ReactNode } from 'react';

const DRAG_ACTIVATION_DISTANCE_PX = 5;

type QueueReorderLayerProps = {
  enabled: boolean;
  items: string[];
  onDragStart?: () => void;
  onDragEnd?: (evt: DragEndEvent) => void;
  children: ReactNode;
};

export const QueueReorderLayer: FC<QueueReorderLayerProps> = ({
  enabled,
  items,
  onDragStart,
  onDragEnd,
  children,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE_PX },
    }),
  );

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};
