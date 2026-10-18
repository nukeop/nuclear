import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

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
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      data-testid="sortable-card"
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn({
        'cursor-grab': !attributes['aria-disabled'],
        'z-50': isDragging,
      })}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};
