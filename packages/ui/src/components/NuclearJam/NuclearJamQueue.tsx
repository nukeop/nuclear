import isEmpty from 'lodash-es/isEmpty';
import { FC, useCallback, useEffect, useRef } from 'react';

import { QueueItem } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { Badge } from '../Badge';
import { ScrollableArea } from '../ScrollableArea';
import {
  NuclearJamEmptyQueue,
  NuclearJamEmptyQueueLabels,
} from './NuclearJamEmptyQueue';
import { NuclearJamQueueItem } from './NuclearJamQueueItem';

export type NuclearJamQueueLabels = NuclearJamEmptyQueueLabels & {
  upNext: string;
};

export type NuclearJamQueueProps = {
  items: QueueItem[];
  currentItemId?: string;
  labels: NuclearJamQueueLabels;
  className?: string;
};

export const NuclearJamQueue: FC<NuclearJamQueueProps> = ({
  items,
  currentItemId,
  labels,
  className,
}) => {
  const currentRef = useRef<HTMLDivElement>(null);
  const prevCurrentId = useRef(currentItemId);

  const scrollToCurrent = useCallback(() => {
    currentRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (currentItemId !== prevCurrentId.current) {
      prevCurrentId.current = currentItemId;
      scrollToCurrent();
    }
  }, [currentItemId, scrollToCurrent]);

  if (isEmpty(items)) {
    return (
      <NuclearJamEmptyQueue
        labels={labels}
        className={cn('min-h-0 flex-1', className)}
      />
    );
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <div
        className="bg-foreground dark:bg-foreground-secondary border-border flex shrink-0 items-center justify-start gap-2 border-y-(length:--border-width) px-4 py-2"
        data-testid="jam-queue-header"
      >
        <span className="font-heading dark:text-background font-extrabold tracking-tight text-white uppercase">
          {labels.upNext}
        </span>

        <Badge
          variant="pill"
          color="yellow"
          data-testid="jam-queue-count"
          className="dark:bg-accent-green dark:border-background dark:text-white"
        >
          {items.length}
        </Badge>
      </div>
      <ScrollableArea className="min-h-0 flex-1">
        {items.map((item) => {
          const isCurrent = item.id === currentItemId;
          return (
            <NuclearJamQueueItem
              key={item.id}
              ref={isCurrent ? currentRef : undefined}
              item={item}
              isCurrent={isCurrent}
            />
          );
        })}
      </ScrollableArea>
    </div>
  );
};
