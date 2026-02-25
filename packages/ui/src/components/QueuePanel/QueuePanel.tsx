import { DragEndEvent } from '@dnd-kit/core';
import { Music } from 'lucide-react';
import { FC } from 'react';

import type { QueueItem as QueueItemType } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { type QueueItemLabels } from '../QueueItem/types';
import { ScrollableArea } from '../ScrollableArea';
import { QueueReorderLayer } from './QueueReorderLayer';
import { ReorderableQueueItem } from './ReorderableQueueItem';

export type QueuePanelProps = {
  items: QueueItemType[];
  currentItemId?: string;
  isCollapsed?: boolean;
  reorderable?: boolean;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onSelectItem?: (itemId: string) => void;
  onRemoveItem?: (itemId: string) => void;
  labels: QueueItemLabels & {
    emptyTitle?: string;
    emptySubtitle?: string;
  };
  classes?: {
    root?: string;
    list?: string;
    empty?: string;
  };
};

export const QueuePanel: FC<QueuePanelProps> = ({
  items,
  currentItemId,
  isCollapsed = false,
  reorderable = true,
  onReorder,
  onSelectItem,
  onRemoveItem,
  labels,
  classes,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) {
      return;
    }

    const fromIndex = items.findIndex((item) => item.id === active.id);
    const toIndex = items.findIndex((item) => item.id === over.id);
    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    onReorder(fromIndex, toIndex);
  };

  if (items.length === 0) {
    return (
      <div
        data-testid="queue-empty-state"
        className={cn(
          'flex h-full flex-col items-center justify-center gap-4 p-8 text-center transition-opacity duration-150',
          {
            'opacity-0': isCollapsed,
            'opacity-100': !isCollapsed,
          },
          classes?.empty,
        )}
      >
        <Music size={64} className="text-foreground-secondary opacity-50" />
        {(labels?.emptyTitle || labels?.emptySubtitle) && (
          <div>
            {labels?.emptyTitle && (
              <div className="text-foreground text-lg font-bold">
                {labels.emptyTitle}
              </div>
            )}
            {labels?.emptySubtitle && (
              <div className="text-foreground-secondary mt-2 text-sm">
                {labels.emptySubtitle}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const itemIds = items.map((item) => item.id);

  return (
    <div
      data-testid="queue-panel"
      className={cn('flex h-full flex-col', classes?.root)}
    >
      <ScrollableArea>
        <QueueReorderLayer
          enabled={reorderable}
          items={itemIds}
          onDragEnd={handleDragEnd}
        >
          <div
            className={cn(
              'flex flex-col',
              isCollapsed ? 'gap-2 p-2' : 'gap-1 p-2',
              classes?.list,
            )}
          >
            {items.map((item) => (
              <ReorderableQueueItem
                key={item.id}
                item={item}
                isCurrent={item.id === currentItemId}
                isCollapsed={isCollapsed}
                isReorderable={reorderable}
                onSelect={onSelectItem}
                onRemove={onRemoveItem}
                labels={{
                  removeButton: labels?.removeButton,
                  playbackError: labels?.playbackError,
                }}
              />
            ))}
          </div>
        </QueueReorderLayer>
      </ScrollableArea>
    </div>
  );
};
