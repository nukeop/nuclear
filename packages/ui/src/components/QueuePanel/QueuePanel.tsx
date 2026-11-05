import { Music } from 'lucide-react';
import { FC, useRef } from 'react';

import type { QueueItem as QueueItemType } from '@nuclearplayer/model';

import { useVirtualRows } from '../../hooks';
import { cn } from '../../utils';
import { QueueItem } from '../QueueItem';
import { type QueueItemLabels } from '../QueueItem/types';
import { ScrollableArea } from '../ScrollableArea';
import { queueLayout } from './constants';
import { QueueReorderLayer } from './QueueReorderLayer';
import { ReorderableQueueItem } from './ReorderableQueueItem';
import { useQueueDrag } from './useQueueDrag';

export type QueuePanelProps = {
  items: QueueItemType[];
  currentItemId?: string;
  isCollapsed?: boolean;
  reorderable?: boolean;
  onMove?: (itemId: string, beforeItemId: string | null) => void;
  onSelectItem?: (itemId: string) => void;
  onRemoveItem?: (itemId: string) => void;
  onSelectCandidate?: (itemId: string, candidateId: string) => void;
  labels: QueueItemLabels & {
    emptyTitle?: string;
    emptySubtitle?: string;
    noCandidates?: string;
    candidateFailed?: string;
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
  onMove,
  onSelectItem,
  onRemoveItem,
  onSelectCandidate,
  labels,
  classes,
}) => {
  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  let rowHeight = queueLayout.rowHeight.expanded;
  if (isCollapsed) {
    rowHeight = queueLayout.rowHeight.collapsed;
  }
  const { displayedItems, draggedItem, dragHandlers } = useQueueDrag(
    items,
    onMove,
  );
  const { virtualItems, paddingTop, paddingBottom } = useVirtualRows({
    count: items.length,
    rowHeight,
    overscan: queueLayout.overscan,
    scrollParentRef,
  });

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
        <Music size={64} className="opacity-50" />
        {(labels?.emptyTitle || labels?.emptySubtitle) && (
          <div>
            {labels?.emptyTitle && (
              <div className="text-lg font-bold">{labels.emptyTitle}</div>
            )}
            {labels?.emptySubtitle && (
              <div className="mt-2 text-sm opacity-70">
                {labels.emptySubtitle}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-testid="queue-panel"
      className={cn('flex h-full flex-col', classes?.root)}
    >
      <ScrollableArea
        viewportRef={scrollParentRef}
        viewportClassName="supports-[font:-apple-system-body]:scroll-smooth"
        testViewportHeight={rowHeight * queueLayout.testViewportRows}
      >
        <QueueReorderLayer
          enabled={reorderable}
          viewportRef={scrollParentRef}
          overlay={
            draggedItem && (
              <QueueItem
                track={draggedItem.track}
                status={draggedItem.status}
                isCurrent={draggedItem.id === currentItemId}
                isCollapsed={isCollapsed}
                errorMessage={draggedItem.error}
                labels={labels}
              />
            )
          }
          {...dragHandlers}
        >
          <div
            className={cn(
              'flex flex-col',
              isCollapsed && 'items-center px-1',
              classes?.list,
            )}
            style={{ paddingTop, paddingBottom }}
          >
            {virtualItems.map((virtualItem) => {
              const item = displayedItems[virtualItem.index];
              return (
                <div key={item.id} style={{ height: rowHeight }}>
                  <ReorderableQueueItem
                    item={item}
                    isCurrent={item.id === currentItemId}
                    isCollapsed={isCollapsed}
                    isReorderable={reorderable}
                    isDropSlot={item.id === draggedItem?.id}
                    onSelect={onSelectItem}
                    onRemove={onRemoveItem}
                    onSelectCandidate={onSelectCandidate}
                    labels={labels}
                  />
                </div>
              );
            })}
          </div>
        </QueueReorderLayer>
      </ScrollableArea>
    </div>
  );
};
