import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { hasSortableData, SortableContext } from '@dnd-kit/sortable';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { CardGridBase } from './CardGridBase';
import {
  dropIntoCollisionDetection,
  dropTargetOf,
  type CanDropInto,
} from './dropIntoCollisionDetection';
import { DropTargetContext, useDropTarget } from './useDropTarget';

type SortableCardGridProps = {
  itemIds: string[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  canDropInto?: CanDropInto;
  onDropInto?: (activeId: string, targetId: string) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
};

export const SortableCardGrid: FC<SortableCardGridProps> = ({
  itemIds,
  onReorder,
  canDropInto,
  onDropInto,
  disabled = false,
  children,
  className,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const { dropTargetId, sortingStrategy, updateDropTarget, endDrag } =
    useDropTarget();

  const handleDragEnd = ({ active, over, collisions }: DragEndEvent) => {
    endDrag();
    const targetId = dropTargetOf(collisions);
    if (targetId) {
      onDropInto?.(String(active.id), targetId);
      return;
    }
    if (hasSortableData(active) && hasSortableData(over)) {
      onReorder(
        active.data.current.sortable.index,
        over.data.current.sortable.index,
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={dropIntoCollisionDetection(canDropInto)}
      onDragMove={updateDropTarget}
      onDragEnd={handleDragEnd}
      onDragCancel={endDrag}
    >
      <SortableContext
        items={itemIds}
        strategy={sortingStrategy}
        disabled={disabled}
      >
        <DropTargetContext.Provider value={dropTargetId}>
          <CardGridBase className={cn('gap-x-7 pt-3 pl-3.5', className)}>
            {children}
          </CardGridBase>
        </DropTargetContext.Provider>
      </SortableContext>
    </DndContext>
  );
};
