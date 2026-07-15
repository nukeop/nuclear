import { Music, Plus } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';
import { FavoriteButton } from '../FavoriteButton';
import type { HistoryRowProps } from './types';

export const HistoryRow: FC<HistoryRowProps> = ({
  title,
  artist,
  time,
  artworkUrl,
  isFavorite = false,
  onToggleFavorite,
  onAddToQueue,
  onPlayNow,
  labels,
  classes,
  className,
  ...props
}) => (
  <div
    data-testid="history-row"
    className={cn(
      'border-border bg-background-secondary group grid grid-cols-[auto_auto_1fr_1fr_auto] items-center border-b-(length:--border-width) select-none',
      classes?.root,
      className,
    )}
    {...props}
  >
    <div className="flex w-10 justify-center">
      {onToggleFavorite && (
        <FavoriteButton
          data-testid="history-row-favorite"
          size="sm"
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          ariaLabelAdd={labels.favorite}
          ariaLabelRemove={labels.unfavorite}
        />
      )}
    </div>

    <div
      data-testid="history-row-thumbnail"
      className={cn(
        'flex h-10 w-10 min-w-10 items-center justify-center overflow-hidden',
        classes?.thumbnail,
      )}
    >
      {artworkUrl ? (
        <img
          src={artworkUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <Music
          size={20}
          absoluteStrokeWidth
          className="text-foreground opacity-20"
        />
      )}
    </div>

    <div
      data-testid="history-row-artist"
      className={cn('truncate px-2', classes?.artist)}
    >
      {artist}
    </div>

    <div className="truncate px-2">
      <div className="flex items-center justify-between gap-2">
        <button
          data-testid="history-row-title"
          className={cn(
            'min-w-0 flex-1 cursor-pointer truncate text-left hover:underline',
            classes?.title,
          )}
          onClick={(e) => {
            e.stopPropagation();
            onPlayNow?.();
          }}
        >
          {title}
        </button>
        {onAddToQueue && (
          <Button
            data-testid="history-row-add-to-queue"
            size="icon-sm"
            variant="text"
            className="opacity-0 transition-none group-hover:opacity-100"
            aria-label={labels.addToQueue}
            onClick={(e) => {
              e.stopPropagation();
              onAddToQueue();
            }}
          >
            <Plus size={16} />
          </Button>
        )}
      </div>
    </div>

    <div
      data-testid="history-row-played-at"
      className={cn('w-24 px-2 whitespace-nowrap tabular-nums', classes?.time)}
    >
      {time}
    </div>
  </div>
);
