import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { FC, ReactNode } from 'react';

import { CardGridBase } from './CardGridBase';

type SortableCardGridProps = {
  itemIds: string[];
  onMove: (itemId: string, targetId: string) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
};

export const SortableCardGrid: FC<SortableCardGridProps> = ({
  itemIds,
  onMove,
  disabled = false,
  children,
  className,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      onMove(String(active.id), String(over.id));
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={itemIds}
        strategy={rectSortingStrategy}
        disabled={disabled}
      >
        <CardGridBase className={className}>{children}</CardGridBase>
      </SortableContext>
    </DndContext>
  );
};
