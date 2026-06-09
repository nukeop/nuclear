import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC } from 'react';

import type { QueueItem as QueueItemType } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { QueueItem } from '../QueueItem';
import { type QueueItemLabels } from '../QueueItem/types';
import { QueueItemPopover } from '../QueueItemPopover';

export type ReorderableQueueItemProps = {
  item: QueueItemType;
  isCurrent: boolean;
  isCollapsed?: boolean;
  isReorderable?: boolean;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
  labels: QueueItemLabels;
};

export const ReorderableQueueItem: FC<ReorderableQueueItemProps> = ({
  item,
  isCurrent,
  isCollapsed = false,
  isReorderable = false,
  onSelect,
  onRemove,
  labels,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: !isReorderable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn({
        'z-50': isDragging,
        'cursor-grab': isReorderable,
      })}
      {...attributes}
      {...listeners}
    >
      <QueueItemPopover track={item.track} className="relative">
        <QueueItem
          track={item.track}
          status={item.status}
          isCurrent={isCurrent}
          isCollapsed={isCollapsed}
          errorMessage={item.error}
          onSelect={() => onSelect?.(item.id)}
          onRemove={() => onRemove?.(item.id)}
          labels={labels}
        />
      </QueueItemPopover>
    </div>
  );
};
