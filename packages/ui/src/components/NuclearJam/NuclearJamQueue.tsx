import { Music2 } from 'lucide-react';
import { FC, useCallback, useEffect, useRef } from 'react';

import { pickArtwork, QueueItem } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeMillis } from '../../utils/time';
import { ScrollableArea } from '../ScrollableArea';

export type NuclearJamQueueProps = {
  items: QueueItem[];
  currentItemId?: string;
  className?: string;
};

export const NuclearJamQueue: FC<NuclearJamQueueProps> = ({
  items,
  currentItemId,
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

  return (
    <div className={cn('min-h-0 flex-1', className)}>
      <ScrollableArea className="h-full">
        {items.map((item) => {
          const thumbnail = pickArtwork(item.track.artwork, 'thumbnail', 48);
          const primaryArtist = item.track.artists[0]?.name;
          const duration = formatTimeMillis(item.track.durationMs);
          const isCurrent = item.id === currentItemId;

          return (
            <div
              key={item.id}
              ref={isCurrent ? currentRef : undefined}
              className={cn(
                'border-border flex items-center gap-3 border-b-(length:--border-width) px-4 py-2',
                isCurrent && 'bg-primary/10',
              )}
              data-testid="jam-queue-item"
              data-is-current={isCurrent}
            >
              <div className="border-border bg-background-secondary flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border-(length:--border-width)">
                {thumbnail?.url ? (
                  <img
                    src={thumbnail.url}
                    alt={item.track.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <Music2 size={20} className="text-foreground opacity-20" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    'truncate text-sm font-bold',
                    isCurrent ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {item.track.title}
                </div>
                {primaryArtist && (
                  <div className="text-foreground-secondary truncate text-xs">
                    {primaryArtist}
                  </div>
                )}
              </div>

              {duration && (
                <div className="text-foreground-secondary shrink-0 text-xs tabular-nums">
                  {duration}
                </div>
              )}
            </div>
          );
        })}
      </ScrollableArea>
    </div>
  );
};
