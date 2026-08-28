import { Music2 } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type PlayerBarNowPlayingProps = {
  title: string;
  artist: string;
  coverUrl?: string;
  className?: string;
  action?: ReactNode;
  onTitleClick?: () => void;
  onArtistClick?: () => void;
};

export const PlayerBarNowPlaying: FC<PlayerBarNowPlayingProps> = ({
  title,
  artist,
  coverUrl,
  className = '',
  action,
  onTitleClick,
  onArtistClick,
}) => (
  <div className={cn('flex min-w-0 items-center gap-3', className)}>
    <div className="border-border bg-background-secondary size-12 shrink-0 overflow-hidden rounded-md border-(length:--border-width)">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt=""
          className="size-full object-cover select-none"
          data-testid="player-now-playing-thumbnail"
        />
      ) : (
        <div
          className="text-foreground-secondary flex size-full items-center justify-center"
          data-testid="player-now-playing-placeholder"
        >
          <Music2 size={20} />
        </div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <div
        className={cn('text-foreground truncate text-sm font-bold', {
          'cursor-pointer hover:underline': onTitleClick,
        })}
        data-testid="now-playing-title"
        onClick={onTitleClick}
      >
        {title}
      </div>
      <div
        className={cn('text-foreground-secondary truncate text-xs', {
          'cursor-pointer hover:underline': onArtistClick,
        })}
        data-testid="player-now-playing-artist"
        onClick={onArtistClick}
      >
        {artist}
      </div>
    </div>
    {action}
  </div>
);
