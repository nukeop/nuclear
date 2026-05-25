import isEmpty from 'lodash-es/isEmpty';
import { FC, useCallback, useEffect, useRef } from 'react';

import { QueueItem } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { ScrollableArea } from '../ScrollableArea';
import {
  NuclearJamEmptyQueue,
  NuclearJamEmptyQueueLabels,
} from './NuclearJamEmptyQueue';
import { NuclearJamQueueItem } from './NuclearJamQueueItem';

export type NuclearJamQueueProps = {
  items: QueueItem[];
  currentItemId?: string;
  labels: NuclearJamEmptyQueueLabels;
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
    <div className={cn('min-h-0 flex-1', className)}>
      <ScrollableArea className="h-full">
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
