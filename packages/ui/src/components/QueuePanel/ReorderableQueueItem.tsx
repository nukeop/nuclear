import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCombinedRefs } from '@dnd-kit/utilities';
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
  isDropSlot?: boolean;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
  onSelectCandidate?: (itemId: string, candidateId: string) => void;
  labels: QueueItemLabels & {
    noCandidates?: string;
    candidateFailed?: string;
  };
};

export const ReorderableQueueItem: FC<ReorderableQueueItemProps> = ({
  item,
  isCurrent,
  isCollapsed = false,
  isReorderable = false,
  isDropSlot = false,
  onSelect,
  onRemove,
  onSelectCandidate,
  labels,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
  } = useDraggable({
    id: item.id,
    disabled: !isReorderable,
    attributes: { roleDescription: 'sortable' },
  });
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: item.id,
    disabled: !isReorderable,
  });
  const setNodeRef = useCombinedRefs(setDraggableNodeRef, setDroppableNodeRef);

  return (
    <div
      ref={setNodeRef}
      data-queue-row-id={item.id}
      className={cn('h-full pb-1', {
        'cursor-grab': isReorderable,
      })}
      {...attributes}
      {...listeners}
    >
      {isDropSlot && <DropSlot isCollapsed={isCollapsed} />}
      {!isDropSlot && (
        <QueueItemPopover
          track={item.track}
          className="relative"
          labels={{
            noCandidates: labels.noCandidates,
            failed: labels.candidateFailed,
          }}
          onSelectCandidate={(candidateId) =>
            onSelectCandidate?.(item.id, candidateId)
          }
        >
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
      )}
    </div>
  );
};

const DropSlot: FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <div
    data-testid="queue-drop-slot"
    className={cn(
      'border-border bg-muted/50 h-full rounded-md border-(length:--border-width) border-dashed',
      { 'aspect-square': isCollapsed, 'w-full': !isCollapsed },
    )}
  />
);
