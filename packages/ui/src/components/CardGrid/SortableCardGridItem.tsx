import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { CardDragHandle } from './CardDragHandle';

type SortableCardGridItemProps = {
  id: string;
  children: ReactNode;
};

export const SortableCardGridItem: FC<SortableCardGridItemProps> = ({
  id,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const isDraggable = !attributes['aria-disabled'];

  return (
    <div
      data-testid="sortable-card"
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('relative w-fit', { 'z-50': isDragging })}
    >
      <div className="peer">{children}</div>
      {isDraggable && (
        <CardDragHandle
          ref={setActivatorNodeRef}
          className="peer-hover:translate-x-shadow-x peer-hover:translate-y-[calc(-50%+var(--shadow-y))]"
          {...attributes}
          {...listeners}
        />
      )}
    </div>
  );
};
