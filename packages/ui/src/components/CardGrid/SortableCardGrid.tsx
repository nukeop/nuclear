import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  hasSortableData,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { CardGridBase } from './CardGridBase';

type SortableCardGridProps = {
  itemIds: string[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
};

export const SortableCardGrid: FC<SortableCardGridProps> = ({
  itemIds,
  onReorder,
  disabled = false,
  children,
  className,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (hasSortableData(active) && hasSortableData(over)) {
      onReorder(
        active.data.current.sortable.index,
        over.data.current.sortable.index,
      );
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={itemIds}
        strategy={rectSortingStrategy}
        disabled={disabled}
      >
        <CardGridBase className={cn('gap-x-7 pl-3.5', className)}>
          {children}
        </CardGridBase>
      </SortableContext>
    </DndContext>
  );
};
