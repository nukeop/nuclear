import { Music2 } from 'lucide-react';
import { forwardRef } from 'react';

import { pickArtwork, QueueItem } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeMillis } from '../../utils/time';

type NuclearJamQueueItemProps = {
  item: QueueItem;
  isCurrent: boolean;
};

export const NuclearJamQueueItem = forwardRef<
  HTMLDivElement,
  NuclearJamQueueItemProps
>(({ item, isCurrent }, ref) => {
  const thumbnail = pickArtwork(item.track.artwork, 'thumbnail', 48);
  const primaryArtist = item.track.artists[0]?.name;
  const duration = formatTimeMillis(item.track.durationMs);

  return (
    <div
      ref={ref}
      className={cn(
        'border-border flex items-center gap-3 border-b-(length:--border-width) px-4 py-2',
        isCurrent && 'bg-primary',
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
        <div className="text-foreground truncate text-sm font-bold">
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
});

NuclearJamQueueItem.displayName = 'NuclearJamQueueItem';
