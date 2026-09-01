import { CassetteTape, X } from 'lucide-react';
import { forwardRef } from 'react';

import { pickArtwork, QueueItem } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { Button } from '../Button';

type NuclearJamQueueItemProps = {
  item: QueueItem;
  isCurrent: boolean;
  onRemove?: () => void;
};

export const NuclearJamQueueItem = forwardRef<
  HTMLDivElement,
  NuclearJamQueueItemProps
>(({ item, isCurrent, onRemove }, ref) => {
  const thumbnail = pickArtwork(item.track.artwork, 'thumbnail', 48);
  const primaryArtist = item.track.artists[0]?.name;

  return (
    <div
      ref={ref}
      className={cn(
        'border-border flex items-center gap-3 border-b-(length:--border-width) px-4 py-2',
        isCurrent && 'surface-primary',
      )}
      data-testid="jam-queue-item"
      data-is-current={isCurrent}
    >
      <div className="border-border bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border-(length:--border-width)">
        {thumbnail?.url ? (
          <img
            src={thumbnail.url}
            alt={item.track.title}
            className="size-full object-cover"
          />
        ) : (
          <CassetteTape
            size={40}
            absoluteStrokeWidth
            className="text-foreground opacity-20"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-foreground truncate text-sm font-bold">
          {item.track.title}
        </div>
        {primaryArtist && (
          <div className="text-foreground/60 truncate text-xs">
            {primaryArtist}
          </div>
        )}
      </div>

      {onRemove && (
        <Button
          data-testid="jam-queue-item-remove-button"
          size="icon-sm"
          variant="noShadow"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onRemove();
          }}
          onPointerDown={(event) => event.stopPropagation()}
          className="shrink-0"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
});

NuclearJamQueueItem.displayName = 'NuclearJamQueueItem';
